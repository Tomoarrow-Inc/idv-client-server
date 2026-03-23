/**
 * Old API wire-format types.
 * Source of truth: src/swagger/old-api.openapi.json
 * These types match the legacy idv-client /internal page endpoints.
 */

// ── Request types ──

export type OldSessionBody = {
  session_id: string;
};

export type OldStoreKycBody = {
  session_id: string;
  idv_session_id: string;
};

// ── Response types ──

export type OldIsVerifiedResp = {
  verified: boolean;
};

export type OldVerifiedResp = {
  verified: boolean;
};

export type OldAddressHashForm = {
  city?: string;
  country?: string;
  postal_code?: string;
  region?: string;
  street?: string;
  street2?: string;
};

export type OldNameHashForm = {
  family_name?: string;
  given_name?: string;
};

export type OldPlaidKycHashResp = {
  address?: OldAddressHashForm;
  birthday?: string;
  name?: OldNameHashForm;
};
