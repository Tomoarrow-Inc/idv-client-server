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
