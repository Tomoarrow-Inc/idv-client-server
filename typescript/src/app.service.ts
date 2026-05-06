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

  // Old problem: the generated SDK serializer can drop newly introduced typed
  // kyc_policy fields before idv-server validates/routes them. Improved by idvStart.
  async idvStartOld(body: StartIdvReq): Promise<StartIdvRes> {
    return this.api.v1IdvStartPost({
      Authorization: this.bearerToken(),
      StartIdvReq: body,
    });
  }

  async idvStart(body: StartIdvReq): Promise<StartIdvRes> {
    return this.proxyPost('/v1/idv/start', body) as Promise<StartIdvRes>;
  }

  async idvKycGet(body: GetKycReq): Promise<GetKycRes> {
    return this.api.v1IdvKycGetPost({
      Authorization: this.bearerToken(),
      GetKycReq: body,
    });
  }

  // ── Session (vendor-agnostic) ──

  // Old problem: the generated SDK serializer can drop newly introduced typed
  // kyc_policy fields before idv-server validates/routes them. Improved by idvSessionStart.
  async idvSessionStartOld(body: SessionStartReq): Promise<SessionStartRes> {
    return this.api.v1IdvSessionsStartPost({
      Authorization: this.bearerToken(),
      SessionStartReq: body,
    });
  }

  async idvSessionStart(body: SessionStartReq): Promise<SessionStartRes> {
    return this.proxyPost('/v1/idv/sessions/start', body) as Promise<SessionStartRes>;
  }

  // ── CN start ──

  async idvStartCN(body: {
    user_id: string;
    callback_url?: string;
    card_image_base64?: string;
    best_frame_base64?: string;
  }): Promise<unknown> {
    return this.proxyPost('/v1/idv/cn/start', body);
  }

  // ── Per-country start ──

  async idvCountryStart(
    country: string,
    body: {
      user_id: string;
      callback_url?: string;
      email?: string;
    },
  ): Promise<unknown> {
    return this.proxyPost(`/v1/idv/${country}/start`, body);
  }

  // ── Per-country kyc/get ──

  async idvCountryKycGet(
    country: string,
    body: { user_id: string },
  ): Promise<unknown> {
    return this.proxyPost(`/v1/idv/${country}/kyc/get`, body);
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

  private async proxyPost(path: string, body: unknown): Promise<unknown> {
    const response = await fetch(`${this.resolveBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        Authorization: this.bearerToken(),
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    });
    const responseBody = await response.text();

    if (!response.ok) {
      throw new UpstreamResponseError(
        response.status,
        responseBody,
        response.headers.get('content-type') ?? undefined,
      );
    }

    try {
      return JSON.parse(responseBody) as unknown;
    } catch {
      return responseBody;
    }
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
