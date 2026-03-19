import { Injectable } from '@nestjs/common';
import { DefaultApi } from 'tomo-idv-client-node';
import type {
  OldSessionBody,
  OldStoreKycBody,
  OldIsVerifiedResp,
  OldVerifiedResp,
  OldPlaidKycHashResp,
} from './api-contract-old';

@Injectable()
export class LegacyService {
  constructor(private readonly api: DefaultApi) {}

  // ── Manual request helpers (copied for full independence) ──

  private async apiPost<T>(path: string, body?: unknown, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json;charset=utf-8' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const response = await (this.api as any).request({ path, method: 'POST', headers, body });
    return await response.json();
  }

  private async apiGet<T>(path: string): Promise<T> {
    const response = await (this.api as any).request({
      path, method: 'GET',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    });
    return await response.json();
  }

  // ── Old API (Internal) ──

  async oldVerifySession(body: OldSessionBody): Promise<OldVerifiedResp> {
    return this.apiPost('/v1/verify/session', body);
  }

  async oldGenerateLinkToken(country: string, body: OldSessionBody): Promise<any> {
    return this.apiPost(`/v1/${country}/generate_link_token`, body);
  }

  async oldGetResults(country: string, body: OldSessionBody): Promise<OldPlaidKycHashResp> {
    return this.apiPost(`/v1/${country}/results`, body);
  }

  async oldStoreKyc(country: string, body: OldStoreKycBody): Promise<void> {
    return this.apiPost(`/v1/${country}/store`, body);
  }

  async oldVerifyKyc(country: string, body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.apiPost(`/v1/${country}/verify/kyc`, body);
  }

  async oldJpGetIcInfo(sessionId: string): Promise<any> {
    return this.apiGet(`/v1/jp/applicants/${encodeURIComponent(sessionId)}/id_document_ic_information`);
  }

  async oldJpStore(body: OldSessionBody): Promise<void> {
    return this.apiPost('/v1/jp/store', body);
  }

  async oldJpVerifyKyc(body: OldSessionBody): Promise<OldIsVerifiedResp> {
    return this.apiPost('/v1/jp/verify/kyc', body);
  }
}
