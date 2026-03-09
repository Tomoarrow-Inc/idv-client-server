import { DefaultApi } from './generated/apis/DefaultApi';
import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { StartIdvResp } from './generated/models/StartIdvResp';
import type { GetKycResp } from './generated/models/GetKycResp';
import type { SessionToken } from './generated/models/SessionToken';
import type { LoginTicketResponse } from './generated/models/LoginTicketResponse';
import type { EitherStringValue } from './generated/models/EitherStringValue';
import type { TomoIdvStartRes } from './generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './generated/models/TomoIdvMockIssueTokenRes';
import type { GoogleStartResp } from './generated/models/GoogleStartResp';
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
} from './api-contract';

function resolveBaseUrl(): string {
  const raw =
    process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
  return raw.replace(/\/+$/, '');
}

function createConfiguration(): Configuration {
  return new Configuration({ basePath: resolveBaseUrl() });
}

/**
 * idv-server OpenAPI contract client.
 * Transparent proxy — no field conversion. Body types match generated types (snake_case).
 */
export class IdvServerClient {
  private readonly api: DefaultApi;

  constructor(config?: Configuration) {
    this.api = new DefaultApi(config ?? createConfiguration());
  }

  // ── OAuth2 ──

  async issueToken(params: {
    client_assertion: string;
    client_assertion_type: string;
    grant_type: string;
    resource?: string;
    scope?: string;
  }): Promise<TokenResponse> {
    return this.api.v1Oauth2TokenPost({
      client_assertion: params.client_assertion,
      client_assertion_type: params.client_assertion_type,
      grant_type: params.grant_type,
      resource: params.resource,
      scope: params.scope,
    });
  }

  // ── Generic (country-agnostic) ──

  async idvStart(accessToken: string, body: IdvStartBody): Promise<StartIdvResp> {
    return this.api.v1IdvStartPost({
      Authorization: `Bearer ${accessToken}`,
      StartIdvReq: body,
    });
  }

  async idvKycGet(accessToken: string, body: IdvKycGetBody): Promise<GetKycResp> {
    return this.api.v1IdvKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      GetKycReq: body,
    });
  }

  // ── Google Social KYC ──

  /** TODO: OpenAPI contract-distribute 후 generated method로 교체 */
  async googleStart(accessToken: string, body: GoogleStartBody): Promise<GoogleStartResp> {
    const response = await (this.api as any).request({
      path: '/v1/idv/social/google/start',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  // ── WeChat Social KYC ──

  /** TODO: OpenAPI contract-distribute 후 generated method로 교체 */
  async wechatStart(accessToken: string, body: WeChatStartBody): Promise<WeChatStartResp> {
    const response = await (this.api as any).request({
      path: '/v1/idv/social/wechat/start',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  // ── WeChat Mock Social KYC ──

  /** TODO: OpenAPI contract-distribute 후 generated method로 교체 */
  async wechatMockStart(accessToken: string, body: WeChatStartBody): Promise<WeChatStartResp> {
    const response = await (this.api as any).request({
      path: '/v1/idv/social/wechat-mock/start',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  // ── Social Result ──

  /** TODO: OpenAPI contract-distribute 후 generated method로 교체 */
  async socialResult(accessToken: string, body: SocialResultBody): Promise<GetKycResp> {
    const response = await (this.api as any).request({
      path: '/v1/idv/social/result',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  // ── US (Plaid) ──

  async idvStartUS(accessToken: string, body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsStartPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidStartIdvRequest: body,
    });
  }

  async getKycUS(accessToken: string, body: GetKycUsBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUsKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidGetKycReq: body,
    });
  }

  async putKycUS(body: PutKycUsBody): Promise<void> {
    return this.api.v1IdvUsKycPutPost({
      PlaidPutKycReq: body,
    });
  }

  async idvCookieStartUS(body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsCookieStartPost({
      PlaidStartIdvRequest: body,
    });
  }

  async healthUS(): Promise<string> {
    return this.api.v1IdvUsHealthGet();
  }

  // ── UK (Plaid) ──

  async idvStartUK(accessToken: string, body: IdvUkStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUkStartPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidStartIdvRequest: body,
    });
  }

  async getKycUK(accessToken: string, body: GetKycUkBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUkKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidGetKycReq: body,
    });
  }

  async putKycUK(body: PutKycUkBody): Promise<void> {
    return this.api.v1IdvUkKycPutPost({
      PlaidPutKycReq: body,
    });
  }

  async idvCookieStartUK(body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUkCookieStartPost({
      PlaidStartIdvRequest: body,
    });
  }

  async healthUK(): Promise<string> {
    return this.api.v1IdvUkHealthGet();
  }

  // ── CA (Plaid) ──

  async idvStartCA(accessToken: string, body: IdvCaStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvCaStartPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidStartIdvRequest: body,
    });
  }

  async getKycCA(accessToken: string, body: GetKycCaBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvCaKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      PlaidGetKycReq: body,
    });
  }

  async putKycCA(body: PutKycCaBody): Promise<void> {
    return this.api.v1IdvCaKycPutPost({
      PlaidPutKycReq: body,
    });
  }

  async idvCookieStartCA(body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvCaCookieStartPost({
      PlaidStartIdvRequest: body,
    });
  }

  async healthCA(): Promise<string> {
    return this.api.v1IdvCaHealthGet();
  }

  // ── JP (Liquid) ──

  async idvStartJP(accessToken: string, body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpStartPost({
      Authorization: `Bearer ${accessToken}`,
      LiquidStartIdvRequest: body,
    });
  }

  async getKycJP(accessToken: string, body: GetKycJpBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvJpKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      LiquidGetKycReq: body,
    });
  }

  async putKycJP(body: PutKycJpBody): Promise<void> {
    return this.api.v1IdvJpKycPutPost({
      LiquidPutKycReq: body,
    });
  }

  async idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpCookieStartPost({
      LiquidStartIdvRequest: body,
    });
  }

  async notificationJP(body: any): Promise<EitherStringValue> {
    return this.api.v1IdvJpNotificationPost({
      body,
    });
  }

  async healthJP(): Promise<string> {
    return this.api.v1IdvJpHealthGet();
  }

  // ── CN (TomoIdv) ──

  async idvStartCN(accessToken: string, body: IdvCnStartBody): Promise<TomoIdvStartRes> {
    return this.api.v1IdvCnStartPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvStartReq: body,
    });
  }

  async idvTokenCN(accessToken: string, body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes> {
    return this.api.v1IdvCnTokenPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvIssueTokenReq: body,
    });
  }

  async idvKycGetCN(accessToken: string, body: IdvCnKycGetBody): Promise<any> {
    return this.api.v1IdvCnKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvGetResultReq: body,
    });
  }

  async idvResultWebCN(): Promise<any> {
    return this.api.v1IdvCnResultWebPost();
  }

  async healthCN(): Promise<string> {
    return this.api.v1IdvCnHealthGet();
  }

  async idvMockStartCN(accessToken: string, body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes> {
    return this.api.v1IdvCnMockStartPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvMockStartReq: body,
    });
  }

  async idvMockTokenCN(accessToken: string, body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes> {
    return this.api.v1IdvCnMockTokenPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvMockIssueTokenReq: body,
    });
  }

  async idvMockKycGetCN(accessToken: string, body: IdvCnMockKycGetBody): Promise<any> {
    return this.api.v1IdvCnMockKycGetPost({
      Authorization: `Bearer ${accessToken}`,
      TomoIdvMockGetResultReq: body,
    });
  }

  // ── Session Tokens ──

  async plaidTokenSession(body: PlaidSessionTokenBody): Promise<SessionToken> {
    return this.api.v1IdvPlaidTokenSessionPost({
      PlaidSessionTokenRequest: body,
    });
  }

  async liquidTokenSession(body: LiquidSessionTokenBody): Promise<SessionToken> {
    return this.api.v1IdvLiquidTokenSessionPost({
      LiquidSessionTokenRequest: body,
    });
  }

  // ── Login Ticket ──

  async loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse> {
    return this.api.v1IdvLoginTicketPost({
      LoginTicketRequest: body,
    });
  }
}
