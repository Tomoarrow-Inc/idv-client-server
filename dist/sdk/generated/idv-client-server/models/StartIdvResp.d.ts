export interface StartIdvResp {
    startIdvUri: string;
}
export declare function instanceOfStartIdvResp(value: object): value is StartIdvResp;
export declare function StartIdvRespFromJSON(json: any): StartIdvResp;
export declare function StartIdvRespFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartIdvResp;
export declare function StartIdvRespToJSON(json: any): StartIdvResp;
export declare function StartIdvRespToJSONTyped(value?: StartIdvResp | null, ignoreDiscriminator?: boolean): any;
