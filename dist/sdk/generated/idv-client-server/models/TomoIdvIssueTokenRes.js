"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvIssueTokenRes = instanceOfTomoIdvIssueTokenRes;
exports.TomoIdvIssueTokenResFromJSON = TomoIdvIssueTokenResFromJSON;
exports.TomoIdvIssueTokenResFromJSONTyped = TomoIdvIssueTokenResFromJSONTyped;
exports.TomoIdvIssueTokenResToJSON = TomoIdvIssueTokenResToJSON;
exports.TomoIdvIssueTokenResToJSONTyped = TomoIdvIssueTokenResToJSONTyped;
function instanceOfTomoIdvIssueTokenRes(value) {
    if (!('expiresIn' in value) || value['expiresIn'] === undefined)
        return false;
    if (!('key' in value) || value['key'] === undefined)
        return false;
    if (!('sessionToken' in value) || value['sessionToken'] === undefined)
        return false;
    return true;
}
function TomoIdvIssueTokenResFromJSON(json) {
    return TomoIdvIssueTokenResFromJSONTyped(json, false);
}
function TomoIdvIssueTokenResFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'expiresIn': json['expires_in'],
        'key': json['key'],
        'sessionToken': json['session_token'],
    };
}
function TomoIdvIssueTokenResToJSON(json) {
    return TomoIdvIssueTokenResToJSONTyped(json, false);
}
function TomoIdvIssueTokenResToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'expires_in': value['expiresIn'],
        'key': value['key'],
        'session_token': value['sessionToken'],
    };
}
//# sourceMappingURL=TomoIdvIssueTokenRes.js.map