import { DefaultApi } from './generated/apis/DefaultApi';
import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { GetKycUnionResp } from './api-contract';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/models/StartIdvResp';
import type { TomoIdvStartRes } from './generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './generated/models/TomoIdvMockIssueTokenRes';
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

  async getKycUS(accessToken: string, body: GetKycUsBody): Promise<GetKycUnionResp> {
    return this.api.v1IdvUsKycGetPost({
      authorization: `Bearer ${accessToken}`,
      plaidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async getKycJP(accessToken: string, body: GetKycJpBody): Promise<GetKycUnionResp> {
    return this.api.v1IdvJpKycGetPost({
      authorization: `Bearer ${accessToken}`,
      liquidGetKycReq: { userId: body.user_id, fields: body.fields },
    });
  }

  async idvStartJP(
    accessToken: string,
    body: IdvJpStartBody
  ): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpStartPost({
      authorization: `Bearer ${accessToken}`,
      liquidStartIdvRequest: {
        userId: body.user_id,
        callbackUrl: body.callback_url,
      },
    });
  }

  async idvStartUS(
    accessToken: string,
    body: IdvUsStartBody
  ): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email,
        callbackUrl: body.callback_url,
      },
    });
  }

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
}
