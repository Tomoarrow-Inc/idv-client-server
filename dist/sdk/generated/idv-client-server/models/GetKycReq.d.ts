import type { Country } from './Country';
export interface GetKycReq {
    country: Country;
    userId: string;
}
export declare function instanceOfGetKycReq(value: object): boolean;
export declare function GetKycReqFromJSON(json: any): GetKycReq;
export declare function GetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycReq;
export declare function GetKycReqToJSON(value?: GetKycReq | null): any;
