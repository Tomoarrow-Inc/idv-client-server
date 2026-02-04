import type { LiquidGetKycResp } from './LiquidGetKycResp';
import type { PlaidGetKycResp } from './PlaidGetKycResp';
export type GetKycUnionResp = LiquidGetKycResp | PlaidGetKycResp | {
    [key: string]: string;
};
export declare function GetKycUnionRespFromJSON(json: any): GetKycUnionResp;
export declare function GetKycUnionRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycUnionResp;
export declare function GetKycUnionRespToJSON(json: any): any;
export declare function GetKycUnionRespToJSONTyped(value?: GetKycUnionResp | null, ignoreDiscriminator?: boolean): any;
