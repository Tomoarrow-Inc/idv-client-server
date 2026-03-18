/**
 * Legacy (old) API client for idv-server.
 * Endpoints from old-api.openapi.json — used by idv-client /internal page.
 * Uses the same runtime (BaseAPI.request) as the new API client.
 *
 * TODO: Replace manual request() calls with generated methods
 *       when openapi-generator-cli is run against old-api.openapi.json.
 */

import { Configuration } from './generated/runtime';
import { DefaultApi } from './generated/apis/DefaultApi';
import type {
  OldSessionBody,
  OldStoreKycBody,
  OldIsVerifiedResp,
  OldVerifiedResp,
  OldPlaidKycHashResp,
} from './api-contract-old';

function resolveBaseUrl(): string {
  const raw =
    process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
  return raw.replace(/\/+$/, '');
}

function createConfiguration(): Configuration {
  return new Configuration({ basePath: resolveBaseUrl() });
}

export class IdvOldClient {
  private readonly api: DefaultApi;

  constructor(config?: Configuration) {
    this.api = new DefaultApi(config ?? createConfiguration());
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await (this.api as any).request({
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body,
    });
    return await response.json();
  }

  private async get<T>(path: string): Promise<T> {
    const response = await (this.api as any).request({
      path,
      method: 'GET',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    });
    return await response.json();
  }

  // ── Session ──

  async verifySession(body: OldSessionBody): Promise<OldVerifiedResp> {
    return this.post('/v1/verify/session', body);
  }

  // ── Plaid (US/UK/CA) ──

  async generateLinkToken(country: string, body: OldSessionBody): Promise<any> {
    return this.post(`/v1/${country}/generate_link_token`, body);
  }

  async getResults(country: string, body: OldSessionBody): Promise<OldPlaidKycHashResp> {
    return this.post(`/v1/${country}/results`, body);
  }

  async storeKyc(country: string, body: OldStoreKycBody): Promise<void> {
    return this.post(`/v1/${country}/store`, body);
  }

  async verifyKyc(country: string, body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.post(`/v1/${country}/verify/kyc`, body);
  }

  // ── Liquid (JP) ──

  async jpGetIcInfo(sessionId: string): Promise<any> {
    return this.get(`/v1/jp/applicants/${encodeURIComponent(sessionId)}/id_document_ic_information`);
  }

  async jpStore(body: OldSessionBody): Promise<void> {
    return this.post('/v1/jp/store', body);
  }

  async jpVerifyKyc(body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.post('/v1/jp/verify/kyc', body);
  }
}
