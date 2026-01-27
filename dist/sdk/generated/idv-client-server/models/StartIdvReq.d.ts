import type { Country } from './Country';
export interface StartIdvReq {
    callbackUrl: string;
    country?: Country;
    email: string;
    userId: string;
}
export declare function instanceOfStartIdvReq(value: object): boolean;
export declare function StartIdvReqFromJSON(json: any): StartIdvReq;
export declare function StartIdvReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartIdvReq;
export declare function StartIdvReqToJSON(value?: StartIdvReq | null): any;
