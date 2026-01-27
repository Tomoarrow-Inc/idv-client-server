export interface LiquidStartIdvRequest {
    callbackUrl: string;
    userId: string;
}
export declare function instanceOfLiquidStartIdvRequest(value: object): boolean;
export declare function LiquidStartIdvRequestFromJSON(json: any): LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidStartIdvRequest;
export declare function LiquidStartIdvRequestToJSON(value?: LiquidStartIdvRequest | null): any;
