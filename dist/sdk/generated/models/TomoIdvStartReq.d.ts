export interface TomoIdvStartReq {
    redirectUrl: string;
    userId: string;
}
export declare function instanceOfTomoIdvStartReq(value: object): boolean;
export declare function TomoIdvStartReqFromJSON(json: any): TomoIdvStartReq;
export declare function TomoIdvStartReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): TomoIdvStartReq;
export declare function TomoIdvStartReqToJSON(value?: TomoIdvStartReq | null): any;
