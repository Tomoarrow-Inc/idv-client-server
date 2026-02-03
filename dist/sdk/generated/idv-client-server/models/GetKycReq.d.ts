import type { Country } from './Country';
export interface GetKycReq {
    country: Country;
    userId: string;
}
export declare function instanceOfGetKycReq(value: object): value is GetKycReq;
export declare function GetKycReqFromJSON(json: any): GetKycReq;
export declare function GetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycReq;
export declare function GetKycReqToJSON(json: any): GetKycReq;
export declare function GetKycReqToJSONTyped(value?: GetKycReq | null, ignoreDiscriminator?: boolean): any;
