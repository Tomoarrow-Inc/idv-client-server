import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion } from './sdk/tomo-idv-node';
import { IdvServerClient } from './idvServer/idvServerClient';
import type { TokenResponse } from './sdk';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';
import type {
  GetKycUsBody,
  GetKycJpBody,
  IdvUsStartBody,
  IdvJpStartBody,
  IdvStartBody,
  IdvCnStartBody,
  IdvCnTokenBody,
  IdvCnResultBody,
  IdvCnMockStartBody,
  IdvCnMockTokenBody,
  IdvCnMockResultBody,
  GetKycUnionResp,
  PlaidStartIdvResp,
  LiquidIntegratedAppResponse,
  StartIdvResp,
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
    private readonly idvServerClient: IdvServerClient
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async issueClientCredentialsToken(): Promise<TokenResponse> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const tokenResponse = await this.idvServerClient.issueToken({
      clientAssertion,
      clientAssertionType: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grantType: 'client_credentials',
      scope: 'idv.read',
      resource: `https://api.tomopayment.com/v1/idv`,
    });

    this.setState('access_token', tokenResponse.accessToken);
    this.setState('token_info', {
      clientId: TOMO_IDV_CLIENT_ID,
      tokenType: tokenResponse.tokenType,
      expiresIn: tokenResponse.expiresIn,
      scope: tokenResponse.scope ?? null,
      issuedAt: new Date().toISOString(),
    });

    return tokenResponse;
  }

  async getKycUS(body: GetKycUsBody): Promise<GetKycUnionResp> {
    return this.idvServerClient.getKycUS(this.requireAccessToken(), body);
  }

  async getKycJP(body: GetKycJpBody): Promise<GetKycUnionResp> {
    return this.idvServerClient.getKycJP(this.requireAccessToken(), body);
  }

  async idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    return this.idvServerClient.idvStartJP(this.requireAccessToken(), body);
  }

  async idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    return this.idvServerClient.idvStartUS(this.requireAccessToken(), body);
  }

  async idvStart(body: IdvStartBody): Promise<StartIdvResp> {
    return this.idvServerClient.idvStart(this.requireAccessToken(), body);
  }

  // ── CN (TomoIdv) ──

  async idvStartCN(body: IdvCnStartBody): Promise<TomoIdvStartRes> {
    return this.idvServerClient.idvStartCN(this.requireAccessToken(), body);
  }

  async idvTokenCN(body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes> {
    return this.idvServerClient.idvTokenCN(this.requireAccessToken(), body);
  }

  async idvResultCN(body: IdvCnResultBody): Promise<any> {
    return this.idvServerClient.idvResultCN(this.requireAccessToken(), body);
  }

  async idvMockStartCN(body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes> {
    return this.idvServerClient.idvMockStartCN(this.requireAccessToken(), body);
  }

  async idvMockTokenCN(body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes> {
    return this.idvServerClient.idvMockTokenCN(this.requireAccessToken(), body);
  }

  async idvMockResultCN(body: IdvCnMockResultBody): Promise<any> {
    return this.idvServerClient.idvMockResultCN(this.requireAccessToken(), body);
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

  /**
   * State 값 설정
   */
  setState(key: string, value: any): void {
    this.stateService.set(key, value);
  }

  /**
   * State 값 조회
   */
  getState(key: string): any {
    return this.stateService.get(key);
  }

  /**
   * State 값이 존재하는지 확인
   */
  hasState(key: string): boolean {
    return this.stateService.has(key);
  }

  /**
   * State 값 삭제
   */
  deleteState(key: string): boolean {
    return this.stateService.delete(key);
  }

  /**
   * 모든 State 조회
   */
  getAllStates(): Record<string, any> {
    return this.stateService.getAll();
  }

  /**
   * State 값 업데이트
   */
  updateState(key: string, updater: (current: any) => any): void {
    this.stateService.update(key, updater);
  }

  /**
   * State 값 증가
   */
  incrementState(key: string, amount: number = 1): number {
    return this.stateService.increment(key, amount);
  }

  /**
   * State 값 감소
   */
  decrementState(key: string, amount: number = 1): number {
    return this.stateService.decrement(key, amount);
  }

  /**
   * 배열에 값 추가
   */
  pushToState(key: string, value: any): void {
    this.stateService.push(key, value);
  }

  /**
   * 배열에서 값 제거
   */
  removeFromState(key: string, value: any): void {
    this.stateService.remove(key, value);
  }

  /**
   * 객체에 속성 추가/업데이트
   */
  setStateProperty(key: string, property: string, value: any): void {
    this.stateService.setProperty(key, property, value);
  }

  /**
   * 객체에서 속성 제거
   */
  removeStateProperty(key: string, property: string): void {
    this.stateService.removeProperty(key, property);
  }

  /**
   * State 변경 리스너 등록
   */
  subscribeToState(key: string, callback: (value: any) => void): () => void {
    return this.stateService.subscribe(key, callback);
  }

  /**
   * State 개수 조회
   */
  getStateCount(): number {
    return this.stateService.size();
  }

  /**
   * 특정 패턴과 일치하는 키들 조회
   */
  getStateKeys(pattern?: string): string[] {
    return this.stateService.getKeys(pattern);
  }

  /**
   * State 백업
   */
  backupState(): string {
    return this.stateService.backup();
  }

  /**
   * State 복원
   */
  restoreState(backup: string): void {
    this.stateService.restore(backup);
  }

  /**
   * 모든 State 삭제
   */
  clearAllStates(): void {
    this.stateService.clear();
  }
}
