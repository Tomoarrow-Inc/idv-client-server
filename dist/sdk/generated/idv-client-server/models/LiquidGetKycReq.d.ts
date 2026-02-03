import type { LiquidIdvField } from './LiquidIdvField';
export interface LiquidGetKycReq {
    fields?: Array<LiquidIdvField>;
    userId: string;
}
export declare function instanceOfLiquidGetKycReq(value: object): value is LiquidGetKycReq;
export declare function LiquidGetKycReqFromJSON(json: any): LiquidGetKycReq;
export declare function LiquidGetKycReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidGetKycReq;
export declare function LiquidGetKycReqToJSON(json: any): LiquidGetKycReq;
export declare function LiquidGetKycReqToJSONTyped(value?: LiquidGetKycReq | null, ignoreDiscriminator?: boolean): any;
