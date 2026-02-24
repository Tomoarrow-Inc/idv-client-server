import type { PlaidIdvField } from './generated/models/PlaidIdvField';
import type { LiquidIdvField } from './generated/models/LiquidIdvField';
import type { Country } from './generated/models/Country';
export type GetKycUnionResp = Record<string, string>;
export type GetKycUsBody = {
    user_id: string;
    fields?: PlaidIdvField[];
};
export type GetKycJpBody = {
    user_id: string;
    fields?: LiquidIdvField[];
};
export type IdvUsStartBody = {
    user_id: string;
    email: string;
    callback_url: string;
};
export type IdvJpStartBody = {
    user_id: string;
    callback_url: string;
};
export type IdvStartBody = {
    user_id: string;
    callback_url: string;
    email: string;
    country: Country;
};
export type IdvCnStartBody = {
    user_id: string;
    redirect_url: string;
};
export type IdvCnTokenBody = {
    user_id: string;
};
export type IdvCnResultBody = {
    user_id: string;
};
export type IdvCnMockStartBody = {
    user_id: string;
    redirect_url: string;
};
export type IdvCnMockTokenBody = {
    user_id: string;
};
export type IdvCnMockResultBody = {
    user_id: string;
};
