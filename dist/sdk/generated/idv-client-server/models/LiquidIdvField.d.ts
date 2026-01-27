export declare const LiquidIdvField: {
    readonly Name: "name";
    readonly DateOfBirth: "date_of_birth";
    readonly Sex: "sex";
    readonly Address: "address";
    readonly PostalCode: "postal_code";
};
export type LiquidIdvField = typeof LiquidIdvField[keyof typeof LiquidIdvField];
export declare function LiquidIdvFieldFromJSON(json: any): LiquidIdvField;
export declare function LiquidIdvFieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): LiquidIdvField;
export declare function LiquidIdvFieldToJSON(value?: LiquidIdvField | null): any;
