import type { Country } from './Country';
export interface StartIdvReq {
    callbackUrl: string;
    country?: Country;
    email: string;
    userId: string;
}
export declare function instanceOfStartIdvReq(value: object): value is StartIdvReq;
export declare function StartIdvReqFromJSON(json: any): StartIdvReq;
export declare function StartIdvReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartIdvReq;
export declare function StartIdvReqToJSON(json: any): StartIdvReq;
export declare function StartIdvReqToJSONTyped(value?: StartIdvReq | null, ignoreDiscriminator?: boolean): any;
