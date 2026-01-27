export interface GetKycResp {
    city?: string;
    country: string;
    dateOfBirth: string;
    emailAddress?: string;
    familyName?: string;
    fullAddress: string;
    fullName: string;
    givenName?: string;
    phoneNumber?: string;
    postalCode?: string;
    region?: string;
    sex?: string;
    street?: string;
}
export declare function instanceOfGetKycResp(value: object): boolean;
export declare function GetKycRespFromJSON(json: any): GetKycResp;
export declare function GetKycRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycResp;
export declare function GetKycRespToJSON(value?: GetKycResp | null): any;
