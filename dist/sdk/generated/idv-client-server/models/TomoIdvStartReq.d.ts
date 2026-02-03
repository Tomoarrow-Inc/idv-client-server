export interface TomoIdvStartReq {
    redirectUrl: string;
    userId: string;
}
export declare function instanceOfTomoIdvStartReq(value: object): value is TomoIdvStartReq;
export declare function TomoIdvStartReqFromJSON(json: any): TomoIdvStartReq;
export declare function TomoIdvStartReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): TomoIdvStartReq;
export declare function TomoIdvStartReqToJSON(json: any): TomoIdvStartReq;
export declare function TomoIdvStartReqToJSONTyped(value?: TomoIdvStartReq | null, ignoreDiscriminator?: boolean): any;
