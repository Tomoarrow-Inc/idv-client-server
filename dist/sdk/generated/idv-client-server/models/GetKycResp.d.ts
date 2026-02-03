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
export declare function instanceOfGetKycResp(value: object): value is GetKycResp;
export declare function GetKycRespFromJSON(json: any): GetKycResp;
export declare function GetKycRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycResp;
export declare function GetKycRespToJSON(json: any): GetKycResp;
export declare function GetKycRespToJSONTyped(value?: GetKycResp | null, ignoreDiscriminator?: boolean): any;
