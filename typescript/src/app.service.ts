import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion } from 'tomo-idv-client-node';
import { IdvServerClient } from './sdk/idv-client';
import { IdvOldClient } from './sdk/idv-old-client';
import type {
  TokenResponse, PlaidStartIdvResp, LiquidIntegratedAppResponse,
  StartIdvResp, GetKycResp, SessionToken, LoginTicketResponse,
  EitherStringValue, TomoIdvStartRes, TomoIdvIssueTokenRes,
  TomoIdvMockStartRes, TomoIdvMockIssueTokenRes, GoogleStartResp,
} from 'tomo-idv-client-node';
import type {
  // Generic
  IdvStartBody,
  IdvKycGetBody,
  // US
  IdvUsStartBody,
  GetKycUsBody,
  PutKycUsBody,
  IdvUsCookieStartBody,
  PlaidSessionTokenBody,
  // UK
  IdvUkStartBody,
  GetKycUkBody,
  PutKycUkBody,
  IdvUkCookieStartBody,
  // CA
  IdvCaStartBody,
  GetKycCaBody,
  PutKycCaBody,
  IdvCaCookieStartBody,
  // JP
  IdvJpStartBody,
  GetKycJpBody,
  PutKycJpBody,
  IdvJpCookieStartBody,
  LiquidSessionTokenBody,
  // CN
  IdvCnStartBody,
  IdvCnTokenBody,
  IdvCnKycGetBody,
  IdvCnMockStartBody,
  IdvCnMockTokenBody,
  IdvCnMockKycGetBody,
  // Login Ticket
  LoginTicketBody,
  // Google Social KYC
  GoogleStartBody,
  // WeChat Social KYC
  WeChatStartBody,
  WeChatStartResp,
  // Social Result
  SocialResultBody,
  // Old API
  OldSessionBody,
  OldStoreKycBody,
  OldIsVerifiedResp,
  OldVerifiedResp,
  OldPlaidKycHashResp,
} from './sdk';

type SafeFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; message: string };

const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID as string;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET as string;

@Injectable()
export class AppService {
  constructor(
    private readonly stateService: StateService,
    private readonly idvServerClient: IdvServerClient,
    private readonly idvOldClient: IdvOldClient,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // ── OAuth2 ──

  async issueClientCredentialsToken(): Promise<TokenResponse> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const tokenResponse = await this.idvServerClient.issueToken({
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

  async idvStart(body: IdvStartBody): Promise<StartIdvResp> {
    return this.idvServerClient.idvStart(this.requireAccessToken(), body);
  }

  async idvKycGet(body: IdvKycGetBody): Promise<GetKycResp> {
    return this.idvServerClient.idvKycGet(this.requireAccessToken(), body);
  }

  // ── Google Social KYC ──

  async googleStart(body: GoogleStartBody): Promise<GoogleStartResp> {
    return this.idvServerClient.googleStart(this.requireAccessToken(), body);
  }

  // ── WeChat Social KYC ──

  async wechatStart(body: WeChatStartBody): Promise<WeChatStartResp> {
    return this.idvServerClient.wechatStart(this.requireAccessToken(), body);
  }

  // ── WeChat Mock Social KYC ──

  async wechatMockStart(body: WeChatStartBody): Promise<WeChatStartResp> {
    const result = await this.idvServerClient.wechatMockStart(this.requireAccessToken(), body);
    // authorization_url을 BFF 상대경로로 변환 (Docker 내부 호스트명 → 브라우저 접근 가능)
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
    const body = await response.text().catch(() => '');
    throw new Error(
      `Mock callback failed: status=${response.status}, url=${url}, body=${body.slice(0, 500)}`
    );
  }

  // ── Social Result ──

  async socialResult(body: SocialResultBody): Promise<GetKycResp> {
    return this.idvServerClient.socialResult(this.requireAccessToken(), body);
  }

  // ── US (Plaid) ──

  async idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvStartUS(this.requireAccessToken(), body);
  }

  async getKycUS(body: GetKycUsBody): Promise<{ [key: string]: string }> {
    return this.idvServerClient.getKycUS(this.requireAccessToken(), body);
  }

  async putKycUS(body: PutKycUsBody): Promise<void> {
    return this.idvServerClient.putKycUS(body);
  }

  async idvCookieStartUS(body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvCookieStartUS(body);
  }

  async healthUS(): Promise<string> {
    return this.idvServerClient.healthUS();
  }

  // ── UK (Plaid) ──

  async idvStartUK(body: IdvUkStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvStartUK(this.requireAccessToken(), body);
  }

  async getKycUK(body: GetKycUkBody): Promise<{ [key: string]: string }> {
    return this.idvServerClient.getKycUK(this.requireAccessToken(), body);
  }

  async putKycUK(body: PutKycUkBody): Promise<void> {
    return this.idvServerClient.putKycUK(body);
  }

  async idvCookieStartUK(body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvCookieStartUK(body);
  }

  async healthUK(): Promise<string> {
    return this.idvServerClient.healthUK();
  }

  // ── CA (Plaid) ──

  async idvStartCA(body: IdvCaStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvStartCA(this.requireAccessToken(), body);
  }

  async getKycCA(body: GetKycCaBody): Promise<{ [key: string]: string }> {
    return this.idvServerClient.getKycCA(this.requireAccessToken(), body);
  }

  async putKycCA(body: PutKycCaBody): Promise<void> {
    return this.idvServerClient.putKycCA(body);
  }

  async idvCookieStartCA(body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvCookieStartCA(body);
  }

  async healthCA(): Promise<string> {
    return this.idvServerClient.healthCA();
  }

  // ── JP (Liquid) ──

  async idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    this.requireNumericUserId(body.user_id);
    return this.idvServerClient.idvStartJP(this.requireAccessToken(), body);
  }

  async getKycJP(body: GetKycJpBody): Promise<{ [key: string]: string }> {
    this.requireNumericUserId(body.user_id);
    return this.idvServerClient.getKycJP(this.requireAccessToken(), body);
  }

  async putKycJP(body: PutKycJpBody): Promise<void> {
    this.requireNumericUserId(body.user_id);
    return this.idvServerClient.putKycJP(body);
  }

  async idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse> {
    this.requireNumericUserId(body.user_id);
    return this.idvServerClient.idvCookieStartJP(body);
  }

  async notificationJP(body: any): Promise<EitherStringValue> {
    return this.idvServerClient.notificationJP(body);
  }

  async healthJP(): Promise<string> {
    return this.idvServerClient.healthJP();
  }

  // ── CN (TomoIdv) ──

  async idvStartCN(body: IdvCnStartBody): Promise<TomoIdvStartRes> {
    return this.idvServerClient.idvStartCN(this.requireAccessToken(), body);
  }

  async idvTokenCN(body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes> {
    return this.idvServerClient.idvTokenCN(this.requireAccessToken(), body);
  }

  async idvKycGetCN(body: IdvCnKycGetBody): Promise<any> {
    return this.idvServerClient.idvKycGetCN(this.requireAccessToken(), body);
  }

  async idvResultWebCN(): Promise<any> {
    return this.idvServerClient.idvResultWebCN();
  }

  async healthCN(): Promise<string> {
    return this.idvServerClient.healthCN();
  }

  async idvMockStartCN(body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes> {
    return this.idvServerClient.idvMockStartCN(this.requireAccessToken(), body);
  }

  async idvMockTokenCN(body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes> {
    return this.idvServerClient.idvMockTokenCN(this.requireAccessToken(), body);
  }

  async idvMockKycGetCN(body: IdvCnMockKycGetBody): Promise<any> {
    return this.idvServerClient.idvMockKycGetCN(this.requireAccessToken(), body);
  }

  // ── Session Tokens ──

  async plaidTokenSession(body: PlaidSessionTokenBody): Promise<SessionToken> {
    return this.idvServerClient.plaidTokenSession(body);
  }

  async liquidTokenSession(body: LiquidSessionTokenBody): Promise<SessionToken> {
    this.requireNumericUserId(body.user_id);
    return this.idvServerClient.liquidTokenSession(body);
  }

  // ── Login Ticket ──

  async loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse> {
    return this.idvServerClient.loginTicket(body);
  }

  // ── Old API (Internal) ──

  async oldVerifySession(body: OldSessionBody): Promise<OldVerifiedResp> {
    return this.idvOldClient.verifySession(body);
  }

  async oldGenerateLinkToken(country: string, body: OldSessionBody): Promise<any> {
    return this.idvOldClient.generateLinkToken(country, body);
  }

  async oldGetResults(country: string, body: OldSessionBody): Promise<OldPlaidKycHashResp> {
    return this.idvOldClient.getResults(country, body);
  }

  async oldStoreKyc(country: string, body: OldStoreKycBody): Promise<void> {
    return this.idvOldClient.storeKyc(country, body);
  }

  async oldVerifyKyc(country: string, body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.idvOldClient.verifyKyc(country, body);
  }

  async oldJpGetIcInfo(sessionId: string): Promise<any> {
    return this.idvOldClient.jpGetIcInfo(sessionId);
  }

  async oldJpStore(body: OldSessionBody): Promise<void> {
    return this.idvOldClient.jpStore(body);
  }

  async oldJpVerifyKyc(body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.idvOldClient.jpVerifyKyc(body);
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
