export interface PlaidStartIdvResp {
    startIdvUri: string;
}
export declare function instanceOfPlaidStartIdvResp(value: object): value is PlaidStartIdvResp;
export declare function PlaidStartIdvRespFromJSON(json: any): PlaidStartIdvResp;
export declare function PlaidStartIdvRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidStartIdvResp;
export declare function PlaidStartIdvRespToJSON(json: any): PlaidStartIdvResp;
export declare function PlaidStartIdvRespToJSONTyped(value?: PlaidStartIdvResp | null, ignoreDiscriminator?: boolean): any;
