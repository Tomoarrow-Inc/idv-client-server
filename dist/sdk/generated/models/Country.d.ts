export declare const Country: {
    readonly Us: "us";
    readonly Uk: "uk";
    readonly Ca: "ca";
    readonly Jp: "jp";
    readonly Unknown: "unknown";
};
export type Country = typeof Country[keyof typeof Country];
export declare function CountryFromJSON(json: any): Country;
export declare function CountryFromJSONTyped(json: any, ignoreDiscriminator: boolean): Country;
export declare function CountryToJSON(value?: Country | null): any;
