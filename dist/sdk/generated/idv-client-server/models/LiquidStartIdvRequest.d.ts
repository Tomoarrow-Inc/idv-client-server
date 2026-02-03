export interface LiquidStartIdvRequest {
    callbackUrl: string;
    userId: string;
}
export declare function instanceOfLiquidStartIdvRequest(value: object): value is LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestFromJSON(json: any): LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestToJSON(json: any): LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestToJSONTyped(value?: LiquidStartIdvRequest | null, ignoreDiscriminator?: boolean): any;
