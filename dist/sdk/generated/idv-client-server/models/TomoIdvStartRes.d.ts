export interface TomoIdvStartRes {
    startIdvUri: string;
}
export declare function instanceOfTomoIdvStartRes(value: object): value is TomoIdvStartRes;
export declare function TomoIdvStartResFromJSON(json: any): TomoIdvStartRes;
export declare function TomoIdvStartResFromJSONTyped(json: any, ignoreDiscriminator: boolean): TomoIdvStartRes;
export declare function TomoIdvStartResToJSON(json: any): TomoIdvStartRes;
export declare function TomoIdvStartResToJSONTyped(value?: TomoIdvStartRes | null, ignoreDiscriminator?: boolean): any;
