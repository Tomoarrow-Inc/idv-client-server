/**
 * idv-server API wire-format request body types.
 * Same schema as controller HTTP body and idv-server request body (snake_case).
 */

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
