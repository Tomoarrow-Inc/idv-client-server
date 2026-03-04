/**
 * idv-server API wire-format request body types.
 * Same schema as controller HTTP body and idv-server request body (snake_case).
 * Aligned with OpenAPI generated models (Source of Truth).
 */

import type { PlaidIdvField } from './generated/models/PlaidIdvField';
import type { LiquidIdvField } from './generated/models/LiquidIdvField';
import type { Country } from './generated/models/Country';

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

export type PutKycUsBody = {
  user_id: string;
  idv_session_id: string;
};

export type IdvUsCookieStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
};

export type PlaidSessionTokenBody = {
  user_id: string;
  idv_session_id?: string;
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

export type PutKycUkBody = {
  user_id: string;
  idv_session_id: string;
};

export type IdvUkCookieStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
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

export type PutKycCaBody = {
  user_id: string;
  idv_session_id: string;
};

export type IdvCaCookieStartBody = {
  user_id: string;
  email: string;
  callback_url: string;
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

export type PutKycJpBody = {
  user_id: string;
};

export type IdvJpCookieStartBody = {
  user_id: string;
  callback_url: string;
};

export type LiquidSessionTokenBody = {
  user_id: string;
};

// ── CN (TomoIdv) ──

export type IdvCnStartBody = {
  user_id: string;
  redirect_url: string;
};

export type IdvCnTokenBody = {
  user_id: string;
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

// ── Login Ticket ──

export type LoginTicketBody = {
  login_ticket?: string;
  biz_token?: string;
};
