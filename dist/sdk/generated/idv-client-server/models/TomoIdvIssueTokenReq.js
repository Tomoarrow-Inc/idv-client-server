"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvIssueTokenReq = instanceOfTomoIdvIssueTokenReq;
exports.TomoIdvIssueTokenReqFromJSON = TomoIdvIssueTokenReqFromJSON;
exports.TomoIdvIssueTokenReqFromJSONTyped = TomoIdvIssueTokenReqFromJSONTyped;
exports.TomoIdvIssueTokenReqToJSON = TomoIdvIssueTokenReqToJSON;
exports.TomoIdvIssueTokenReqToJSONTyped = TomoIdvIssueTokenReqToJSONTyped;
function instanceOfTomoIdvIssueTokenReq(value) {
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function TomoIdvIssueTokenReqFromJSON(json) {
    return TomoIdvIssueTokenReqFromJSONTyped(json, false);
}
function TomoIdvIssueTokenReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'userId': json['user_id'],
    };
}
function TomoIdvIssueTokenReqToJSON(json) {
    return TomoIdvIssueTokenReqToJSONTyped(json, false);
}
function TomoIdvIssueTokenReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=TomoIdvIssueTokenReq.js.map