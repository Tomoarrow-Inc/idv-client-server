/**
 * idv-server API wire-format request body types.
 * Same schema as controller HTTP body and idv-server request body (snake_case).
 */

/** Union response for /v1/idv/us/kyc/get, /v1/idv/jp/kyc/get, etc. (generated SDK returns a map). */
export type GetKycUnionResp = Record<string, string>;

export type GetKycUsBody = {
  user_id: string;
  fields?: string[];
};

export type GetKycJpBody = {
  user_id: string;
  fields?: string[];
};

export type IdvUsStartBody = {
  user_id: string;
  email?: string;
  callback_url?: string;
};

export type IdvJpStartBody = {
  user_id: string;
  callback_url?: string;
};

export type IdvStartBody = {
  user_id: string;
  callback_url: string;
  email: string;
  country: string;
};
