import { Json } from './types';

export interface IdvStartReqHeaders extends Headers {
    'Content-Type': Json;
    Authorization: string;
}

export type IdvStartReqBody = {
    user_id: string;
    email: string;
    callback_url: string;
    country?: 'unknown' | 'us' | 'uk' | 'ca' | 'jp';
}
