import { Injectable } from '@nestjs/common';
import { StateService } from '../state.service';
import { DefaultApi } from 'tomo-idv-client-node';
import type { WeChatStartReq, WeChatStartResp } from 'tomo-idv-client-node';

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
