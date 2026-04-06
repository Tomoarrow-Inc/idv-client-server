import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, DefaultApi } from 'tomo-idv-client-node';
import type {
  TokenRes, PlaidStartIdvRes, LiquidIntegratedAppRes,
  StartIdvRes, GetKycRes,
  TencentStartIdvRes,
  LiquidGetUnionResultRes, TencentGetUnionResultRes,
  StartIdvReq,
  GetKycReq,
  PlaidStartIdvReq,
  PlaidGetKycReq,
  LiquidStartIdvReq,
  LiquidGetKycReq,
  TencentStartReq,
  TencentGetKycReq,
} from 'tomo-idv-client-node';

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

  async idvStart(body: StartIdvReq): Promise<StartIdvRes> {
    return this.api.v1IdvStartPost({
      Authorization: this.bearerToken(),
      StartIdvReq: body,
    });
  }

  async idvKycGet(body: GetKycReq): Promise<GetKycRes> {
    return this.api.v1IdvKycGetPost({
      Authorization: this.bearerToken(),
      GetKycReq: body,
    });
  }

  // ── US (Plaid) ──

  async idvStartUS(body: PlaidStartIdvReq): Promise<PlaidStartIdvRes> {
    return this.api.v1IdvUsStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvReq: body,
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

  async idvStartUK(body: PlaidStartIdvReq): Promise<PlaidStartIdvRes> {
    return this.api.v1IdvUkStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvReq: body,
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

  async idvStartCA(body: PlaidStartIdvReq): Promise<PlaidStartIdvRes> {
    return this.api.v1IdvCaStartPost({
      Authorization: this.bearerToken(),
      PlaidStartIdvReq: body,
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

  async idvStartJP(body: LiquidStartIdvReq): Promise<LiquidIntegratedAppRes> {
    this.requireNumericUserId(body.user_id);
    return this.api.v1IdvJpStartPost({
      Authorization: this.bearerToken(),
      LiquidStartIdvReq: body,
    });
  }

  async getKycJP(body: LiquidGetKycReq): Promise<LiquidGetUnionResultRes> {
    this.requireNumericUserId(body.user_id);
    return this.api.v1IdvJpKycGetPost({
      Authorization: this.bearerToken(),
      LiquidGetKycReq: body,
    });
  }

  async healthJP(): Promise<string> {
    return this.api.v1IdvJpHealthGet();
  }

  // ── CN (Tencent) ──

  async idvStartCN(body: TencentStartReq): Promise<TencentStartIdvRes> {
    return this.api.v1IdvCnStartPost({
      Authorization: this.bearerToken(),
      TencentStartReq: body,
    });
  }

  async idvKycGetCN(body: TencentGetKycReq): Promise<TencentGetUnionResultRes> {
    return this.api.v1IdvCnKycGetPost({
      Authorization: this.bearerToken(),
      TencentGetKycReq: body,
    });
  }

  async healthCN(): Promise<string> {
    return this.api.v1IdvCnHealthGet();
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
