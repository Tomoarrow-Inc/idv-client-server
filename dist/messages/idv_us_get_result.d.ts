import { Json } from './types';
export interface IdvUsGetResultReqHeaders extends Headers {
    'Content-Type': Json;
    Authorization: string;
}
export type IdvUsGetResultReqBody = {
    user_id: string;
    fields?: Array<'date_of_birth' | 'email_address' | 'phone_number' | 'family_name' | 'given_name' | 'city' | 'country' | 'postal_code' | 'region' | 'street'>;
};
