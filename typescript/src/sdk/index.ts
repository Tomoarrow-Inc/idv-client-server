// Auth utilities (from tomo-idv-client-node SDK)
export {
  createClientAssertion,
  buildTokenRequest,
  type ClientAssertionOptions,
  type BodyOptions,
} from 'tomo-idv-client-node';

// idv-server contract client
export { IdvServerClient } from './idv-client';

// Old API contract client (idv-client /internal page legacy endpoints)
export { IdvOldClient } from './idv-old-client';

// Request body types (wire format, same as controller / idv-server)
export type {
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

// Response types (from tomo-idv-client-node SDK)
export type {
  TokenResponse, PlaidStartIdvResp, LiquidIntegratedAppResponse,
  StartIdvResp, GetKycResp, SessionToken, LoginTicketResponse,
  EitherStringValue, TomoIdvStartRes, TomoIdvIssueTokenRes,
  TomoIdvMockStartRes, TomoIdvMockIssueTokenRes, GoogleStartResp,
} from 'tomo-idv-client-node';

// Enum types (from tomo-idv-client-node SDK)
export { Country, PlaidIdvField, LiquidIdvField } from 'tomo-idv-client-node';

// Old API request/response types (wire format, from old-api.openapi.json)
export type {
  OldSessionBody,
  OldStoreKycBody,
  OldIsVerifiedResp,
  OldVerifiedResp,
  OldPlaidKycHashResp,
} from './api-contract-old';
