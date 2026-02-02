import { DefaultApi } from './generated/apis/DefaultApi';
import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { GetKycUnionResp } from './generated/models/GetKycUnionResp';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/models/StartIdvResp';
import { Country } from './generated/models/Country';

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
 * Wraps OpenAPI-generated DefaultApi with Configuration.
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

  async getKycUS(accessToken: string, userId: string): Promise<GetKycUnionResp> {
    return this.api.v1IdvUsKycGetPost({
      authorization: `Bearer ${accessToken}`,
      getKycReq: { userId, country: Country.Us },
    });
  }

  async getKycJP(accessToken: string, userId: string): Promise<GetKycUnionResp> {
    return this.api.v1IdvJpKycGetPost({
      authorization: `Bearer ${accessToken}`,
      getKycReq: { userId, country: Country.Jp },
    });
  }

  async idvStartJP(
    accessToken: string,
    userId: string,
    callbackUrl: string = 'idvexpo://verify'
  ): Promise<LiquidIntegratedAppResponse> {
    return this.api.v1IdvJpStartPost({
      authorization: `Bearer ${accessToken}`,
      liquidStartIdvRequest: { userId, callbackUrl },
    });
  }

  async idvStartUS(
    accessToken: string,
    userId: string,
    email: string = 'chanhee@tomoarrow.com',
    callbackUrl: string = 'idvexpo://verify'
  ): Promise<PlaidStartIdvResp> {
    return this.api.v1IdvUsStartPost({
      authorization: `Bearer ${accessToken}`,
      plaidStartIdvRequest: { userId, email, callbackUrl },
    });
  }

  async idvStart(
    accessToken: string,
    userId: string,
    callbackUrl: string,
    email: string,
    country: string
  ): Promise<StartIdvResp> {
    const sirqCountry =
      country === 'US'
        ? Country.Us
        : country === 'UK'
          ? Country.Uk
          : country === 'CA'
            ? Country.Ca
            : country === 'JP'
              ? Country.Jp
              : Country.Unknown;
    return this.api.v1IdvStartPost({
      authorization: `Bearer ${accessToken}`,
      startIdvReq: {
        sirqUserId: userId,
        sirqCallbackUrl: callbackUrl,
        sirqEmail: email,
        sirqCountry,
      },
    });
  }
}
