import { DefaultApi } from './generated/idv-client-server/apis/DefaultApi';
import { Configuration } from './generated/idv-client-server/runtime';
import type { TokenResponse } from './generated/idv-client-server/models/TokenResponse';
import type { GetKycUnionResp } from './generated/idv-client-server/models/GetKycUnionResp';
import type { LiquidIntegratedAppResponse } from './generated/idv-client-server/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/idv-client-server/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/idv-client-server/models/StartIdvResp';
import { Country } from './generated/idv-client-server/models/Country';
import type {
  GetKycUsBody,
  GetKycJpBody,
  IdvUsStartBody,
  IdvJpStartBody,
  IdvStartBody,
} from './api-contract';
import { toSnakeCaseKeys } from './case-converter';

function resolveBaseUrl(): string {
  const raw =
    process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
  return raw.replace(/\/+$/, '');
}

function createConfiguration(): Configuration {
  return new Configuration({ basePath: resolveBaseUrl() });
}

function countryFromString(s: string): Country {
  const u = s?.toUpperCase();
  return u === 'US' ? Country.Us : u === 'UK' ? Country.Uk : u === 'CA' ? Country.Ca : u === 'JP' ? Country.Jp : Country.Unknown;
}

/**
 * idv-server OpenAPI contract client.
 * Methods accept wire-format body (snake_case) to align with controller and idv-server API.
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
    const result = await this.api.v1Oauth2TokenPost({
      clientAssertion: params.clientAssertion,
      clientAssertionType: params.clientAssertionType,
      grantType: params.grantType,
      resource: params.resource,
      scope: params.scope,
    });
    return toSnakeCaseKeys(result) as TokenResponse;
  }

  async getKycUS(accessToken: string, body: GetKycUsBody): Promise<GetKycUnionResp> {
    const result = await this.api.v1IdvUsKycGetPost({
      authorization: `Bearer ${accessToken}`,
      plaidGetKycReq: { userId: body.user_id, fields: body.fields as any },
    });
    return toSnakeCaseKeys(result) as GetKycUnionResp;
  }

  async getKycJP(accessToken: string, body: GetKycJpBody): Promise<GetKycUnionResp> {
    const result = await this.api.v1IdvJpKycGetPost({
      authorization: `Bearer ${accessToken}`,
      liquidGetKycReq: { userId: body.user_id, fields: body.fields as any },
    });
    return toSnakeCaseKeys(result) as GetKycUnionResp;
  }

  async idvStartJP(
    accessToken: string,
    body: IdvJpStartBody
  ): Promise<LiquidIntegratedAppResponse> {
    const result = await this.api.v1IdvJpStartPost({
      authorization: `Bearer ${accessToken}`,
      liquidStartIdvRequest: {
        userId: body.user_id,
        callbackUrl: body.callback_url ?? 'idvexpo://verify',
      },
    });
    return toSnakeCaseKeys(result) as LiquidIntegratedAppResponse;
  }

  async idvStartUS(
    accessToken: string,
    body: IdvUsStartBody
  ): Promise<PlaidStartIdvResp> {
    const result = await this.api.v1IdvUsStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: {
        userId: body.user_id,
        email: body.email ?? 'chanhee@tomoarrow.com',
        callbackUrl: body.callback_url ?? 'idvexpo://verify',
      },
    });
    return toSnakeCaseKeys(result) as PlaidStartIdvResp;
  }

  async idvStart(accessToken: string, body: IdvStartBody): Promise<StartIdvResp> {
    const result = await this.api.v1IdvStartPost({
      authorization: `Bearer ${accessToken}`,
      startIdvReq: {
        userId: body.user_id,
        callbackUrl: body.callback_url,
        email: body.email,
        country: countryFromString(body.country),
      },
    });
    return toSnakeCaseKeys(result) as StartIdvResp;
  }
}
