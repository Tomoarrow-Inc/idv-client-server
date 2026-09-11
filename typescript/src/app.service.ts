import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, DefaultApi } from 'tomo-idv-client-node';
import { UpstreamResponseError } from './upstream-response';
import type {
  TokenRes,
  StartIdvRes,
  StartIdvReq,
  ResultReq,
  ResetReq,
  ResetRes,
  ResultDeleteReq,
  ResultDeleteRes,
  ResultBulkDeleteReq,
  ResultBulkDeleteRes,
} from 'tomo-idv-client-node';

/**
 * /v1/idv/result 응답은 계약 버전(Tomo-API-Version)에 따라 봉투가 달라진다.
 * 생성 SDK의 ResultContractResponse는 1.3/1.4 anyOf를 필수 필드의 합으로
 * 평탄화해 단건 응답에서 깨지므로, BFF는 wire 원문을 그대로 통과시킨다.
 */
export interface UpstreamResultResponse {
  body: unknown;
  version?: string;
}

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

  async idvStart(body: StartIdvReq): Promise<StartIdvRes> {
    return this.api.v1IdvStartPost({
      StartIdvReq: body,
    });
  }

  async idvResult(
    body: ResultReq,
    apiVersion?: string,
  ): Promise<UpstreamResultResponse> {
    // apiVersion이 undefined면 header 자체를 보내지 않는다. 기본 계약 선택은
    // idv-server의 몫이고, BFF가 기본값을 주입하면 전달 투명성이 깨진다.
    const response = await this.api.v1IdvResultPostRaw({
      ResultReq: body,
      ...(apiVersion !== undefined ? { Tomo_API_Version: apiVersion } : {}),
    });
    const text = await response.raw.text();
    return {
      body: this.parseUpstreamJson(text),
      version: response.raw.headers.get('tomo-api-version') ?? undefined,
    };
  }

  private parseUpstreamJson(text: string): unknown {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async idvReset(body: ResetReq): Promise<ResetRes> {
    return this.api.v1IdvResetPost({
      ResetReq: body,
    });
  }

  // delete 응답은 status enum 하나뿐인 단순 객체라 union 평탄화 문제가 없다.
  // result 와 달리 생성 SDK 역직렬화를 그대로 쓴다.
  async idvResultDelete(body: ResultDeleteReq): Promise<ResultDeleteRes> {
    return this.api.v1IdvResultDeletePost({
      ResultDeleteReq: body,
    });
  }

  async idvResultBulkDelete(
    body: ResultBulkDeleteReq,
  ): Promise<ResultBulkDeleteRes> {
    return this.api.v1IdvResultBulkDeletePost({
      ResultBulkDeleteReq: body,
    });
  }

  async proxyPost(path: string, body: unknown): Promise<unknown> {
    const response = await fetch(`${this.resolveBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        Authorization: this.bearerToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    });
    const contentType = response.headers.get('content-type') ?? undefined;
    const text = await response.text();

    if (!response.ok) {
      throw new UpstreamResponseError(response.status, text, contentType);
    }

    if (contentType?.toLowerCase().includes('application/json')) {
      try {
        return text ? JSON.parse(text) : {};
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
    const base =
      process.env.IDV_BASE_URL ??
      process.env.IDV_SERVER ??
      process.env.IDV_BASEURL ??
      'http://idv-server-ghci';
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
