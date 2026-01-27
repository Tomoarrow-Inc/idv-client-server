export interface PlaidGetKycResp {
    city: string;
    country: string;
    dateOfBirth: string;
    emailAddress: string;
    familyName: string;
    givenName: string;
    phoneNumber: string;
    postalCode: string;
    region: string;
    street: string;
}
export declare function instanceOfPlaidGetKycResp(value: object): boolean;
export declare function PlaidGetKycRespFromJSON(json: any): PlaidGetKycResp;
export declare function PlaidGetKycRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidGetKycResp;
export declare function PlaidGetKycRespToJSON(value?: PlaidGetKycResp | null): any;
