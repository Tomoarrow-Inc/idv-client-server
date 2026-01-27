import { Json } from './types';
export type StartReqHeaders = {
    'Content-Type': Json;
};
export type StartReqBody = {
    user_id: string;
    email: string;
    callback_url: string;
    country: string;
};
