export interface StartIdvResp {
    startIdvUri: string;
}
export declare function instanceOfStartIdvResp(value: object): boolean;
export declare function StartIdvRespFromJSON(json: any): StartIdvResp;
export declare function StartIdvRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartIdvResp;
export declare function StartIdvRespToJSON(value?: StartIdvResp | null): any;
