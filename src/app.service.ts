import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion } from './sdk/tomo-idv-node';
import { IdvServerClient } from './idvServer/idvServerClient';
import type { TokenResponse } from './sdk/generated/models/TokenResponse';
import type { PlaidStartIdvResp } from './sdk/generated/models/PlaidStartIdvResp';
import type { LiquidIntegratedAppResponse } from './sdk/generated/models/LiquidIntegratedAppResponse';
import type { StartIdvResp } from './sdk/generated/models/StartIdvResp';
import type { GetKycResp } from './sdk/generated/models/GetKycResp';
import type { SessionToken } from './sdk/generated/models/SessionToken';
import type { LoginTicketResponse } from './sdk/generated/models/LoginTicketResponse';
import type { EitherStringValue } from './sdk/generated/models/EitherStringValue';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';
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

  // ── OAuth2 ──

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

  // ── Generic (country-agnostic) ──

  async idvStart(body: IdvStartBody): Promise<StartIdvResp> {
    return this.idvServerClient.idvStart(this.requireAccessToken(), body);
  }

  async idvKycGet(body: IdvKycGetBody): Promise<GetKycResp> {
    return this.idvServerClient.idvKycGet(this.requireAccessToken(), body);
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
    return this.idvServerClient.idvStartJP(this.requireAccessToken(), body);
  }

  async getKycJP(body: GetKycJpBody): Promise<{ [key: string]: string }> {
    return this.idvServerClient.getKycJP(this.requireAccessToken(), body);
  }

  async putKycJP(body: PutKycJpBody): Promise<void> {
    return this.idvServerClient.putKycJP(body);
  }

  async idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse> {
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
    return this.idvServerClient.liquidTokenSession(body);
  }

  // ── Login Ticket ──

  async loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse> {
    return this.idvServerClient.loginTicket(body);
  }

  // ── Helpers ──

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
