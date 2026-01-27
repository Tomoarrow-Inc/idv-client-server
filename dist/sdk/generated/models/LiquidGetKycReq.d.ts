import type { LiquidIdvField } from './LiquidIdvField';
export interface LiquidGetKycReq {
    fields?: Array<LiquidIdvField>;
    userId: string;
}
export declare function instanceOfLiquidGetKycReq(value: object): boolean;
export declare function LiquidGetKycReqFromJSON(json: any): LiquidGetKycReq;
export declare function LiquidGetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidGetKycReq;
export declare function LiquidGetKycReqToJSON(value?: LiquidGetKycReq | null): any;
