import { Json } from './types';


export interface IdvUsStartReqHeaders extends Headers {
    'Content-Type': Json;
    Authorization: string;
}

export type IdvUsStartReqBody = {
    user_id: string;
    email: string;
    callback_url: string;
}
