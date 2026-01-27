"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvIssueTokenRes = instanceOfTomoIdvIssueTokenRes;
exports.TomoIdvIssueTokenResFromJSON = TomoIdvIssueTokenResFromJSON;
exports.TomoIdvIssueTokenResFromJSONTyped = TomoIdvIssueTokenResFromJSONTyped;
exports.TomoIdvIssueTokenResToJSON = TomoIdvIssueTokenResToJSON;
function instanceOfTomoIdvIssueTokenRes(value) {
    let isInstance = true;
    isInstance = isInstance && "expiresIn" in value;
    isInstance = isInstance && "key" in value;
    isInstance = isInstance && "sessionToken" in value;
    return isInstance;
}
function TomoIdvIssueTokenResFromJSON(json) {
    return TomoIdvIssueTokenResFromJSONTyped(json, false);
}
function TomoIdvIssueTokenResFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'expiresIn': json['expires_in'],
        'key': json['key'],
        'sessionToken': json['session_token'],
    };
}
function TomoIdvIssueTokenResToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'expires_in': value.expiresIn,
        'key': value.key,
        'session_token': value.sessionToken,
    };
}
//# sourceMappingURL=TomoIdvIssueTokenRes.js.map