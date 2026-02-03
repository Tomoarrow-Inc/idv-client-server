export interface LiquidIntegratedAppResponse {
    startIdvUri: string;
}
export declare function instanceOfLiquidIntegratedAppResponse(value: object): value is LiquidIntegratedAppResponse;
export declare function LiquidIntegratedAppResponseFromJSON(json: any): LiquidIntegratedAppResponse;
export declare function LiquidIntegratedAppResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidIntegratedAppResponse;
export declare function LiquidIntegratedAppResponseToJSON(json: any): LiquidIntegratedAppResponse;
export declare function LiquidIntegratedAppResponseToJSONTyped(value?: LiquidIntegratedAppResponse | null, ignoreDiscriminator?: boolean): any;
