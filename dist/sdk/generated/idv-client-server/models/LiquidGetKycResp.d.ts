export interface LiquidGetKycResp {
    address: string;
    dateOfBirth: string;
    name: string;
    postalCode?: string;
    sex: string;
}
export declare function instanceOfLiquidGetKycResp(value: object): value is LiquidGetKycResp;
export declare function LiquidGetKycRespFromJSON(json: any): LiquidGetKycResp;
export declare function LiquidGetKycRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidGetKycResp;
export declare function LiquidGetKycRespToJSON(json: any): LiquidGetKycResp;
export declare function LiquidGetKycRespToJSONTyped(value?: LiquidGetKycResp | null, ignoreDiscriminator?: boolean): any;
