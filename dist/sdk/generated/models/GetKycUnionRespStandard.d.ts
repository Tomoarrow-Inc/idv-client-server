import type { LiquidGetKycResp } from './LiquidGetKycResp';
export interface GetKycUnionRespStandard {
    contents: LiquidGetKycResp;
    tag: GetKycUnionRespStandardTagEnum;
}
export declare const GetKycUnionRespStandardTagEnum: {
    readonly GetKycUnionRespStandard: "GetKycUnionRespStandard";
};
export type GetKycUnionRespStandardTagEnum = typeof GetKycUnionRespStandardTagEnum[keyof typeof GetKycUnionRespStandardTagEnum];
export declare function instanceOfGetKycUnionRespStandard(value: object): boolean;
export declare function GetKycUnionRespStandardFromJSON(json: any): GetKycUnionRespStandard;
export declare function GetKycUnionRespStandardFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycUnionRespStandard;
export declare function GetKycUnionRespStandardToJSON(value?: GetKycUnionRespStandard | null): any;
