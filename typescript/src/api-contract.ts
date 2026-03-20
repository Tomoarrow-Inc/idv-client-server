/**
 * idv-server API wire-format request body types.
 * Same schema as controller HTTP body and idv-server request body (snake_case).
 * Aligned with OpenAPI generated models (Source of Truth).
 */

import type { PlaidIdvField } from 'tomo-idv-client-node';
import type { LiquidIdvField } from 'tomo-idv-client-node';
import type { Country } from 'tomo-idv-client-node';

// ── Generic (country-agnostic) ──

export type IdvStartBody = {
  user_id: string;
  callback_url: string;
  email: string;
  country?: Country;
};

// ── Google Social KYC ──

export type GoogleStartBody = {
  callback_url: string;
  country?: string;
  login_hint?: string;
};

// ── WeChat Social KYC ──

export type WeChatStartBody = {
  callback_url: string;
  country?: string;
  login_hint?: string;
};

export type WeChatStartResp = {
  authorization_url: string;
};

// ── Social Result ──

export type SocialResultBody = {
  social_id: string;
};

export type IdvKycGetBody = {
  user_id: string;
  country: Country;
};

// ── US (Plaid) ──

export type IdvUsStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
};

export type GetKycUsBody = {
  user_id: string;
  fields?: PlaidIdvField[];
};

// ── UK (Plaid) ──

export type IdvUkStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
};

export type GetKycUkBody = {
  user_id: string;
  fields?: PlaidIdvField[];
};

// ── CA (Plaid) ──

export type IdvCaStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
};

export type GetKycCaBody = {
  user_id: string;
  fields?: PlaidIdvField[];
};

// ── JP (Liquid) ──

export type IdvJpStartBody = {
  user_id: string;
  callback_url: string;
};

export type GetKycJpBody = {
  user_id: string;
  fields?: LiquidIdvField[];
};

// ── CN (TomoIdv) ──

export type IdvCnStartBody = {
  user_id: string;
  redirect_url: string;
};

export type IdvCnKycGetBody = {
  user_id: string;
};

export type IdvCnMockStartBody = {
  user_id: string;
  redirect_url: string;
};

export type IdvCnMockTokenBody = {
  user_id: string;
};

export type IdvCnMockKycGetBody = {
  user_id: string;
};

