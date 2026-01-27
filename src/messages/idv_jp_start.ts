import { Json } from './types';

export interface IdvJpStartReqHeaders extends Headers {
    'Content-Type': Json;
    Authorization: string;
}

export type IdvJpStartReqBody = {
    user_id: string;
    callback_url: string;
}
