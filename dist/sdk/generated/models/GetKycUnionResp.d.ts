import type { LiquidGetKycResp } from './LiquidGetKycResp';
export type GetKycUnionResp = LiquidGetKycResp | {
    [key: string]: string;
};
export declare function GetKycUnionRespFromJSON(json: any): GetKycUnionResp;
export declare function GetKycUnionRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycUnionResp;
export declare function GetKycUnionRespToJSON(value?: GetKycUnionResp | null): any;
