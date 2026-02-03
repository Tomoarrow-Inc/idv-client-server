import type { PlaidIdvField } from './PlaidIdvField';
export interface PlaidGetKycReq {
    fields?: Array<PlaidIdvField>;
    userId: string;
}
export declare function instanceOfPlaidGetKycReq(value: object): value is PlaidGetKycReq;
export declare function PlaidGetKycReqFromJSON(json: any): PlaidGetKycReq;
export declare function PlaidGetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidGetKycReq;
export declare function PlaidGetKycReqToJSON(json: any): PlaidGetKycReq;
export declare function PlaidGetKycReqToJSONTyped(value?: PlaidGetKycReq | null, ignoreDiscriminator?: boolean): any;
