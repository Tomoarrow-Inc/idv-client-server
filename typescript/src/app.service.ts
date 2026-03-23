import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, DefaultApi } from 'tomo-idv-client-node';
import type {
  TokenResponse, PlaidStartIdvResp, LiquidIntegratedAppResponse,
  StartIdvResp, GetKycResp,
  TomoIdvStartRes, GoogleStartResp,
  // Request body types (replacing api-contract.ts)
  StartIdvReq,
  GetKycReq,
  PlaidStartIdvRequest,
  PlaidGetKycReq,
  LiquidStartIdvRequest,
  LiquidGetKycReq,
  TomoIdvStartReq,
  TencentGetKycReq,
  GoogleStartReq,
  WeChatStartReq,
  WeChatStartResp,
  SocialResultReq,
} from 'tomo-idv-client-node';

/** CN mock endpoint request types (not in SDK — mock endpoints use raw apiPost) */
type CnMockStartBody = { user_id: string; redirect_url: string };
type CnMockUserIdBody = { user_id: string };

type SafeFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; message: string };

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

  // ── Manual request helpers (for endpoints not in generated API) ──

  private bearerToken(): string {
    return `Bearer ${this.requireAccessToken()}`;
  }

  private async apiPost<T>(path: string, body?: unknown, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json;charset=utf-8' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const response = await (this.api as any).request({ path, method: 'POST', headers, body });
    return await response.json();
  }

  private async apiGet<T>(path: string): Promise<T> {
    const response = await (this.api as any).request({
      path, method: 'GET',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    });
    return await response.json();
  }

  // ── OAuth2 ──

  async issueClientCredentialsToken(): Promise<TokenResponse> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const tokenResponse = await this.api.v1Oauth2TokenPost({
      client_assertion: clientAssertion,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
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

  async idvStart(body: StartIdvReq): Promise<StartIdvResp> {
    return this.api.v1IdvStartPost({
      Authorization: this.bearerToken(),
      StartIdvReq: body,
    });
  }

  async idvKycGet(body: GetKycReq): Promise<GetKycResp> {
    return this.api.v1IdvKycGetPost({
      Authorization: this.bearerToken(),
      GetKycReq: body,
    });
  }

  // ── Google Social KYC ──

  async googleStart(body: GoogleStartReq): Promise<GoogleStartResp> {
    return this.apiPost('/v1/idv/social/google/start', body, this.requireAccessToken());
  }

  // ── WeChat Social KYC ──

  async wechatStart(body: WeChatStartReq): Promise<WeChatStartResp> {
    return this.apiPost('/v1/idv/social/wechat/start', body, this.requireAccessToken());
  }

  // ── WeChat Mock Social KYC ──

  async wechatMockStart(body: WeChatStartReq): Promise<WeChatStartResp> {
    const result = await this.apiPost<WeChatStartResp>(
      '/v1/idv/social/wechat-mock/start', body, this.requireAccessToken(),
    );
    // authorization_url을 BFF 상대경로로 변환 (Docker 내부 호스트명 -> 브라우저 접근 가능)
    if (result.authorization_url) {
      try {
        const url = new URL(result.authorization_url);
        result.authorization_url = url.pathname + url.search;
      } catch { /* URL 파싱 실패 시 원본 유지 */ }
    }
    return result;
  }

  async wechatMockLoginPage(state: string): Promise<string> {
    const baseUrl = this.resolveBaseUrl();
    const response = await fetch(
      `${baseUrl}/v1/idv/social/wechat-mock/login?state=${encodeURIComponent(state)}`,
    );
    let html = await response.text();
    // HTML 내 callback URL도 BFF 상대경로로 변환
    html = html.replace(
      /href='[^']*\/v1\/idv\/social\/wechat-mock\/callback/g,
      "href='/v1/idv/social/wechat-mock/callback",
    );
    html = html.replace(
      /location\.href='[^']*\/v1\/idv\/social\/wechat-mock\/callback/g,
      "location.href='/v1/idv/social/wechat-mock/callback",
    );
    return html;
  }

  async wechatMockCallback(code: string, state: string, error?: string): Promise<string> {
    const baseUrl = this.resolveBaseUrl();
    const params = new URLSearchParams();
    if (code) params.set('code', code);
    if (state) params.set('state', state);
    if (error) params.set('error', error);
    const url = `${baseUrl}/v1/idv/social/wechat-mock/callback?${params.toString()}`;
    const response = await fetch(url, { redirect: 'manual' });
    const location = response.headers.get('location');
    if (location) return location;
    // 302가 아닌 경우 상세 에러 정보 포함
    const respBody = await response.text().catch(() => '');
    throw new Error(
      `Mock callback failed: status=${response.status}, url=${url}, body=${respBody.slice(0, 500)}`
    );
  }

  // ── Social Result ──

  async socialResult(body: SocialResultReq): Promise<GetKycResp> {
    return this.apiPost('/v1/idv/social/result', body, this.requireAccessToken());
  }

  // ── US (Plaid) ──

  async idvStartUS(body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvRequest: body,
    });
  }

  async getKycUS(body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUsKycGetPost({
      Authorization: this.bearerToken(),
      PlaidGetKycReq: body,
    });
  }

  async healthUS(): Promise<string> {
    return this.api.v1IdvUsHealthGet();
  }

  // ── UK (Plaid) ──

  async idvStartUK(body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUkStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvRequest: body,
    });
  }

  async getKycUK(body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUkKycGetPost({
      Authorization: this.bearerToken(),
      PlaidGetKycReq: body,
    });
  }

  async healthUK(): Promise<string> {
    return this.api.v1IdvUkHealthGet();
  }

  // ── CA (Plaid) ──

  async idvStartCA(body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvCaStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvRequest: body,
    });
  }

  async getKycCA(body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    return this.api.v1IdvCaKycGetPost({
      Authorization: this.bearerToken(),
      PlaidGetKycReq: body,
    });
  }

  async healthCA(): Promise<string> {
    return this.api.v1IdvCaHealthGet();
  }

  // ── JP (Liquid) ──

  async idvStartJP(body: LiquidStartIdvRequest): Promise<LiquidIntegratedAppResponse> {
    this.requireNumericUserId(body.user_id);
    return this.api.v1IdvJpStartPost({
      Authorization: this.bearerToken(),
      LiquidStartIdvRequest: body,
    });
  }

  async getKycJP(body: LiquidGetKycReq): Promise<{ [key: string]: string }> {
    this.requireNumericUserId(body.user_id);
    return this.api.v1IdvJpKycGetPost({
      Authorization: this.bearerToken(),
      LiquidGetKycReq: body,
    });
  }

  async healthJP(): Promise<string> {
    return this.api.v1IdvJpHealthGet();
  }

  // ── CN (TomoIdv) ──

  async idvStartCN(body: TomoIdvStartReq): Promise<TomoIdvStartRes> {
    return this.api.v1IdvCnStartPost({
      Authorization: this.bearerToken(),
      TomoIdvStartReq: body,
    });
  }

  async idvKycGetCN(body: TencentGetKycReq): Promise<any> {
    return this.api.v1IdvCnKycGetPost({
      Authorization: this.bearerToken(),
      TencentGetKycReq: body,
    });
  }

  async healthCN(): Promise<string> {
    return this.api.v1IdvCnHealthGet();
  }

  async idvMockStartCN(body: CnMockStartBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/start', body, this.requireAccessToken());
  }

  async idvMockTokenCN(body: CnMockUserIdBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/token', body, this.requireAccessToken());
  }

  async idvMockKycGetCN(body: CnMockUserIdBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/kyc/get', body, this.requireAccessToken());
  }

  // ── Helpers ──

  /**
   * Liquid (JP) provider requires user_id to be numeric only (digits).
   * Throws 400 immediately if user_id contains non-digit characters.
   */
  private requireNumericUserId(userId: string): void {
    if (!/^\d+$/.test(userId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'JP IDV (Liquid) requires a numeric user_id. ' +
            `Received: "${userId}"`,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private requireAccessToken(): string {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /v1/oauth2/token first.');
    }
    return accessToken;
  }

  private resolveBaseUrl(): string {
    const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
    return base.replace(/\/$/, '');
  }

  private async safeFetchJson<T>(url: string, init?: RequestInit): Promise<SafeFetchResult<T>> {
    try {
      const response = await fetch(url, init);
      const text = await response.text();

      if (!response.ok) {
        return { ok: false, status: response.status, message: text || response.statusText };
      }

      try {
        return { ok: true, data: JSON.parse(text) as T };
      } catch {
        return { ok: false, status: response.status, message: 'Invalid JSON response' };
      }
    } catch (error) {
      return { ok: false, message: `Fetch failed: ${error}` };
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
