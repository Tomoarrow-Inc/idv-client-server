import type { PlaidIdvField } from './PlaidIdvField';
export interface PlaidGetKycReq {
    fields?: Array<PlaidIdvField>;
    userId: string;
}
export declare function instanceOfPlaidGetKycReq(value: object): boolean;
export declare function PlaidGetKycReqFromJSON(json: any): PlaidGetKycReq;
export declare function PlaidGetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidGetKycReq;
export declare function PlaidGetKycReqToJSON(value?: PlaidGetKycReq | null): any;
