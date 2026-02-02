// Case converter (customer ↔ SDK wire format)
export { toSnakeCaseKeys, toCamelCaseKeys } from './case-converter';

// Auth utilities (tomo-idv-node)
export {
  createClientAssertion,
  buildTokenRequest,
  type ClientAssertionOptions,
  type BodyOptions,
} from './tomo-idv-node';

// idv-server contract client
export { IdvServerClient } from './idv-client';

// Request body types (wire format, same as controller / idv-server)
export type {
  GetKycUsBody,
  GetKycJpBody,
  IdvUsStartBody,
  IdvJpStartBody,
  IdvStartBody,
} from './api-contract';

// Response types (generated)
export type { TokenResponse } from './generated/idv-client-server/models/TokenResponse';
export type { GetKycUnionResp } from './generated/idv-client-server/models/GetKycUnionResp';
export type { PlaidStartIdvResp } from './generated/idv-client-server/models/PlaidStartIdvResp';
export type { LiquidIntegratedAppResponse } from './generated/idv-client-server/models/LiquidIntegratedAppResponse';
export type { StartIdvResp } from './generated/idv-client-server/models/StartIdvResp';
export { Country } from './generated/idv-client-server/models/Country';
