export interface PlaidStartIdvRequest {
    callbackUrl: string;
    email: string;
    userId: string;
}
export declare function instanceOfPlaidStartIdvRequest(value: object): value is PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestFromJSON(json: any): PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestToJSON(json: any): PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestToJSONTyped(value?: PlaidStartIdvRequest | null, ignoreDiscriminator?: boolean): any;
