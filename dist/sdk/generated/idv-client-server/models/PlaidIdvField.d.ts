export declare const PlaidIdvField: {
    readonly DateOfBirth: "date_of_birth";
    readonly EmailAddress: "email_address";
    readonly PhoneNumber: "phone_number";
    readonly FamilyName: "family_name";
    readonly GivenName: "given_name";
    readonly City: "city";
    readonly Country: "country";
    readonly PostalCode: "postal_code";
    readonly Region: "region";
    readonly Street: "street";
};
export type PlaidIdvField = typeof PlaidIdvField[keyof typeof PlaidIdvField];
export declare function PlaidIdvFieldFromJSON(json: any): PlaidIdvField;
export declare function PlaidIdvFieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaidIdvField;
export declare function PlaidIdvFieldToJSON(value?: PlaidIdvField | null): any;
