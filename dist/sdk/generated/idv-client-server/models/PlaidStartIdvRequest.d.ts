export interface PlaidStartIdvRequest {
    callbackUrl: string;
    email: string;
    userId: string;
}
export declare function instanceOfPlaidStartIdvRequest(value: object): boolean;
export declare function PlaidStartIdvRequestFromJSON(json: any): PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidStartIdvRequest;
export declare function PlaidStartIdvRequestToJSON(value?: PlaidStartIdvRequest | null): any;
