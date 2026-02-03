export interface TomoIdvIssueTokenRes {
    expiresIn: number;
    key: string;
    sessionToken: string;
}
export declare function instanceOfTomoIdvIssueTokenRes(value: object): value is TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResFromJSON(json: any): TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResFromJSONTyped(json: any, ignoreDiscriminator: boolean): TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResToJSON(json: any): TomoIdvIssueTokenRes;
export declare function TomoIdvIssueTokenResToJSONTyped(value?: TomoIdvIssueTokenRes | null, ignoreDiscriminator?: boolean): any;
