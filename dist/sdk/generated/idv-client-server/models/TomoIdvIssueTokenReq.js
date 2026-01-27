"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvIssueTokenReq = instanceOfTomoIdvIssueTokenReq;
exports.TomoIdvIssueTokenReqFromJSON = TomoIdvIssueTokenReqFromJSON;
exports.TomoIdvIssueTokenReqFromJSONTyped = TomoIdvIssueTokenReqFromJSONTyped;
exports.TomoIdvIssueTokenReqToJSON = TomoIdvIssueTokenReqToJSON;
function instanceOfTomoIdvIssueTokenReq(value) {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function TomoIdvIssueTokenReqFromJSON(json) {
    return TomoIdvIssueTokenReqFromJSONTyped(json, false);
}
function TomoIdvIssueTokenReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'userId': json['user_id'],
    };
}
function TomoIdvIssueTokenReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'user_id': value.userId,
    };
}
//# sourceMappingURL=TomoIdvIssueTokenReq.js.map