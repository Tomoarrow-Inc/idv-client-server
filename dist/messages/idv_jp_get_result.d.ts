import { Json } from './types';
export interface IdvJpGetResultReqHeaders extends Headers {
    'Content-Type': Json;
    Authorization: string;
}
export type IdvJpGetResultReqBody = {
    user_id: string;
    fields?: Array<'name' | 'date_of_birth' | 'sex' | 'address' | 'postal_code'>;
};
