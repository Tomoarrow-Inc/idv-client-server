export interface GetKycUnionRespMap {
    contents: {
        [key: string]: string;
    };
    tag: GetKycUnionRespMapTagEnum;
}
export declare const GetKycUnionRespMapTagEnum: {
    readonly GetKycUnionRespMap: "GetKycUnionRespMap";
};
export type GetKycUnionRespMapTagEnum = typeof GetKycUnionRespMapTagEnum[keyof typeof GetKycUnionRespMapTagEnum];
export declare function instanceOfGetKycUnionRespMap(value: object): boolean;
export declare function GetKycUnionRespMapFromJSON(json: any): GetKycUnionRespMap;
export declare function GetKycUnionRespMapFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetKycUnionRespMap;
export declare function GetKycUnionRespMapToJSON(value?: GetKycUnionRespMap | null): any;
