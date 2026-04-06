import { Injectable } from '@nestjs/common';
import { StateService } from '../state.service';
import { DefaultApi } from 'tomo-idv-client-node';

/** CN mock endpoint request types (not in SDK -- mock endpoints use raw apiPost) */
export type CnMockStartBody = { user_id: string; redirect_url: string };
export type CnMockUserIdBody = { user_id: string };

@Injectable()
export class MockService {
  constructor(
    private readonly stateService: StateService,
    private readonly api: DefaultApi,
  ) {}

  // ── Manual request helpers (for mock endpoints not in generated API) ──

  private async apiPost<T>(path: string, body?: unknown, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json;charset=utf-8' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const response = await (this.api as any).request({ path, method: 'POST', headers, body });
    return await response.json();
  }

  private requireAccessToken(): string {
    const accessToken = this.stateService.get('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /v1/oauth2/token first.');
    }
    return accessToken;
  }

  private resolveBaseUrl(): string {
    const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
    return base.replace(/\/$/, '');
  }

  // ── CN Mock ──

  async idvMockStartCN(body: CnMockStartBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/start', body, this.requireAccessToken());
  }

  async idvMockTokenCN(body: CnMockUserIdBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/token', body, this.requireAccessToken());
  }

  async idvMockKycGetCN(body: CnMockUserIdBody): Promise<any> {
    return this.apiPost('/v1/idv/cn/mock/kyc/get', body, this.requireAccessToken());
  }
}
