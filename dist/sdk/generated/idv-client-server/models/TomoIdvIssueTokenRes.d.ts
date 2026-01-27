export interface TomoIdvIssueTokenRes {
    expiresIn: number;
    key: string;
    sessionToken: string;
}
export declare function instanceOfTomoIdvIssueTokenRes(value: object): boolean;
export declare function TomoIdvIssueTokenResFromJSON(json: any): TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResFromJSONTyped(json: any, ignoreDiscriminator: boolean): TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResToJSON(value?: TomoIdvIssueTokenRes | null): any;
