import type { GetKycUnionRespMap } from './GetKycUnionRespMap';
import type { GetKycUnionRespStandard } from './GetKycUnionRespStandard';
export type GetKycUnionResp = GetKycUnionRespMap | GetKycUnionRespStandard;
export declare function GetKycUnionRespFromJSON(json: any): GetKycUnionResp;
export declare function GetKycUnionRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycUnionResp;
export declare function GetKycUnionRespToJSON(value?: GetKycUnionResp | null): any;
