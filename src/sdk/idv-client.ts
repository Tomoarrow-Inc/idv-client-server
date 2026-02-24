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
  IdvCnResultBody,
  IdvCnMockStartBody,
  IdvCnMockTokenBody,
  IdvCnMockResultBody,
  // Login Ticket
  LoginTicketBody,
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
 * Methods accept wire-format body (snake_case) to align with controller and idv-server API.
 * Returns generated types directly (camelCase) — no extra conversion.
 */
export class IdvServerClient {
  private readonly api: DefaultApi;

  constructor(config?: Configuration) {
    this.api = new DefaultApi(config ?? createConfiguration());
  }

  // ── OAuth2 ──

  async issueToken(params: {
    clientAssertion: string;
    clientAssertionType: string;
    grantType: string;
    resource?: string;
    scope?: string;
  }): Promise<TokenResponse> {
    return this.api.v1Oauth2TokenPost({
      clientAssertion: params.clientAssertion,
      clientAssertionType: params.clientAssertionType,
      grantType: params.grantType,
      resource: params.resource,
      scope: params.scope,
    });
  }

  // ── Generic (country-agnostic) ──

  async idvStart(accessToken: string, body: IdvStartBody): Promise<StartIdvResp> {
    return this.api.v1IdvStartPost({
      authorization: `Bearer ${accessToken}`,
      startIdvReq: {
        userId: body.user_id,
        callbackUrl: body.callback_url,
        email: body.email,
        country: body.country,
      },
    });
  }

  async idvKycGet(accessToken: string, body: IdvKycGetBody): Promise<GetKycResp> {
    return this.api.v1IdvKycGetPost({
      authorization: `Bearer ${accessToken}`,
      getKycReq: {
        userId: body.user_id,
        country: body.country,
      },
    });
  }

  // ── US (Plaid) ──

  async idvStartUS(accessToken: string, body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async getKycUS(accessToken: string, body: GetKycUsBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUsKycGetPost({
      authorization: `Bearer ${accessToken}`,
      plaidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async putKycUS(body: PutKycUsBody): Promise<void> {
    return this.api.v1IdvUsKycPutPost({
      plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
    });
  }

  async idvCookieStartUS(body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsCookieStartPost({
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async healthUS(): Promise<string> {
    return this.api.v1IdvUsHealthGet();
  }

  // ── UK (Plaid) ──

  async idvStartUK(accessToken: string, body: IdvUkStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUkStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async getKycUK(accessToken: string, body: GetKycUkBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvUkKycGetPost({
      authorization: `Bearer ${accessToken}`,
      plaidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async putKycUK(body: PutKycUkBody): Promise<void> {
    return this.api.v1IdvUkKycPutPost({
      plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
    });
  }

  async idvCookieStartUK(body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUkCookieStartPost({
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async healthUK(): Promise<string> {
    return this.api.v1IdvUkHealthGet();
  }

  // ── CA (Plaid) ──

  async idvStartCA(accessToken: string, body: IdvCaStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvCaStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async getKycCA(accessToken: string, body: GetKycCaBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvCaKycGetPost({
      authorization: `Bearer ${accessToken}`,
      plaidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async putKycCA(body: PutKycCaBody): Promise<void> {
    return this.api.v1IdvCaKycPutPost({
      plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
    });
  }

  async idvCookieStartCA(body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvCaCookieStartPost({
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

  async healthCA(): Promise<string> {
    return this.api.v1IdvCaHealthGet();
  }

  // ── JP (Liquid) ──

  async idvStartJP(accessToken: string, body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpStartPost({
      authorization: `Bearer ${accessToken}`,
      liquidStartIdvRequest: {
        userId: body.user_id,
        callbackUrl: body.callback_url,
      },
    });
  }

  async getKycJP(accessToken: string, body: GetKycJpBody): Promise<{ [key: string]: string }> {
    return this.api.v1IdvJpKycGetPost({
      authorization: `Bearer ${accessToken}`,
      liquidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async putKycJP(body: PutKycJpBody): Promise<void> {
    return this.api.v1IdvJpKycPutPost({
      liquidPutKycReq: { userId: body.user_id },
    });
  }

  async idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpCookieStartPost({
      liquidStartIdvRequest: {
        userId: body.user_id,
        callbackUrl: body.callback_url,
      },
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
      authorization: `Bearer ${accessToken}`,
      tomoIdvStartReq: {
        userId: body.user_id,
        redirectUrl: body.redirect_url,
      },
    });
  }

  async idvTokenCN(accessToken: string, body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes> {
    return this.api.v1IdvCnTokenPost({
      authorization: `Bearer ${accessToken}`,
      tomoIdvIssueTokenReq: {
        userId: body.user_id,
      },
    });
  }

  async idvResultCN(accessToken: string, body: IdvCnResultBody): Promise<any> {
    return this.api.v1IdvCnResultPost({
      authorization: `Bearer ${accessToken}`,
      tomoIdvGetResultReq: {
        userId: body.user_id,
      },
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
      authorization: `Bearer ${accessToken}`,
      tomoIdvMockStartReq: {
        userId: body.user_id,
        redirectUrl: body.redirect_url,
      },
    });
  }

  async idvMockTokenCN(accessToken: string, body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes> {
    return this.api.v1IdvCnMockTokenPost({
      authorization: `Bearer ${accessToken}`,
      tomoIdvMockIssueTokenReq: {
        userId: body.user_id,
      },
    });
  }

  async idvMockResultCN(accessToken: string, body: IdvCnMockResultBody): Promise<any> {
    return this.api.v1IdvCnMockResultPost({
      authorization: `Bearer ${accessToken}`,
      tomoIdvMockGetResultReq: {
        userId: body.user_id,
      },
    });
  }

  // ── Session Tokens ──

  async plaidTokenSession(body: PlaidSessionTokenBody): Promise<SessionToken> {
    return this.api.v1IdvPlaidTokenSessionPost({
      plaidSessionTokenRequest: {
        userId: body.user_id,
        idvSessionId: body.idv_session_id,
      },
    });
  }

  async liquidTokenSession(body: LiquidSessionTokenBody): Promise<SessionToken> {
    return this.api.v1IdvLiquidTokenSessionPost({
      liquidSessionTokenRequest: {
        userId: body.user_id,
      },
    });
  }

  // ── Login Ticket ──

  async loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse> {
    return this.api.v1IdvLoginTicketPost({
      loginTicketRequest: {
        loginTicket: body.login_ticket,
        bizToken: body.biz_token,
      },
    });
  }
}
