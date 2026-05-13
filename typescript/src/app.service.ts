import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, DefaultApi } from 'tomo-idv-client-node';
import type {
  TokenRes,
  StartIdvRes,
  GetKycRes,
  StartIdvReq,
  GetKycReq,
} from 'tomo-idv-client-node';
import { UpstreamResponseError } from './upstream-response';

const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID as string;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET as string;

type LegacyCountry = 'us' | 'uk' | 'ca' | 'jp' | 'cn';

@Injectable()
export class AppService {
  constructor(
    private readonly stateService: StateService,
    private readonly api: DefaultApi,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private bearerToken(): string {
    return `Bearer ${this.requireAccessToken()}`;
  }

  // ── OAuth2 ──

  async issueClientCredentialsToken(): Promise<TokenRes> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const tokenResponse = await this.api.v1Oauth2TokenPost({
      client_assertion: clientAssertion,
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'client_credentials',
      scope: 'idv.read',
      resource: `https://api.tomopayment.com/v1/idv`,
    });

    this.setState('access_token', tokenResponse.access_token);
    this.setState('token_info', {
      clientId: TOMO_IDV_CLIENT_ID,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in,
      scope: tokenResponse.scope ?? null,
      issuedAt: new Date().toISOString(),
    });

    return tokenResponse;
  }

  // ── Generic (country-agnostic) ──

  async idvStart(body: StartIdvReq): Promise<StartIdvRes> {
    return this.api.v1IdvStartPost({
      Authorization: this.bearerToken(),
      StartIdvReq: body,
    });
  }

  async idvResult(body: GetKycReq): Promise<GetKycRes> {
    return this.api.v1IdvResultPost({
      Authorization: this.bearerToken(),
      GetKycReq: body,
    });
  }

  // ── Deprecated compatibility routes ──

  async legacyKycGet(body: unknown): Promise<unknown> {
    return this.proxyPost('/v1/idv/kyc/get', body, true);
  }

  async legacyCountryStart(
    country: LegacyCountry,
    body: unknown,
  ): Promise<unknown> {
    return this.proxyPost(`/v1/idv/${country}/start`, body, true);
  }

  async legacyUsKycGet(body: unknown): Promise<unknown> {
    return this.proxyPost('/v1/idv/us/kyc/get', body, true);
  }

  async legacyVerifySession(body: unknown): Promise<unknown> {
    return this.proxyPost('/v1/verify/session', body, false);
  }

  private async proxyPost(
    path: string,
    body: unknown,
    withAuthorization: boolean,
  ): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (withAuthorization) {
      headers.Authorization = this.bearerToken();
    }

    const response = await fetch(`${this.resolveBaseUrl()}${path}`, {
      method: 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const contentType = response.headers.get('content-type') ?? undefined;
    const text = await response.text();

    if (!response.ok) {
      throw new UpstreamResponseError(response.status, text, contentType);
    }

    if (!text) {
      return null;
    }

    if (contentType?.toLowerCase().includes('json')) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    return text;
  }

  private requireAccessToken(): string {
    const accessToken = this.getState('access_token') as unknown;
    if (typeof accessToken !== 'string' || !accessToken) {
      throw new Error(
        'No access token found. Please call /v1/oauth2/token first.',
      );
    }
    return accessToken;
  }

  private resolveBaseUrl(): string {
    const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
    return base.replace(/\/$/, '');
  }

  // ==================== State Management Methods ====================

  setState(key: string, value: any): void {
    this.stateService.set(key, value);
  }

  getState(key: string): any {
    return this.stateService.get(key);
  }

  hasState(key: string): boolean {
    return this.stateService.has(key);
  }

  deleteState(key: string): boolean {
    return this.stateService.delete(key);
  }

  getAllStates(): Record<string, any> {
    return this.stateService.getAll();
  }

  updateState(key: string, updater: (current: any) => any): void {
    this.stateService.update(key, updater);
  }

  incrementState(key: string, amount: number = 1): number {
    return this.stateService.increment(key, amount);
  }

  decrementState(key: string, amount: number = 1): number {
    return this.stateService.decrement(key, amount);
  }

  pushToState(key: string, value: any): void {
    this.stateService.push(key, value);
  }

  removeFromState(key: string, value: any): void {
    this.stateService.remove(key, value);
  }

  setStateProperty(key: string, property: string, value: any): void {
    this.stateService.setProperty(key, property, value);
  }

  removeStateProperty(key: string, property: string): void {
    this.stateService.removeProperty(key, property);
  }

  subscribeToState(key: string, callback: (value: any) => void): () => void {
    return this.stateService.subscribe(key, callback);
  }

  getStateCount(): number {
    return this.stateService.size();
  }

  getStateKeys(pattern?: string): string[] {
    return this.stateService.getKeys(pattern);
  }

  backupState(): string {
    return this.stateService.backup();
  }

  restoreState(backup: string): void {
    this.stateService.restore(backup);
  }

  clearAllStates(): void {
    this.stateService.clear();
  }
}
