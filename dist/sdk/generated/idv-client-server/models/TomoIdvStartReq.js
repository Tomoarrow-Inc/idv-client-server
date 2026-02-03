"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvStartReq = instanceOfTomoIdvStartReq;
exports.TomoIdvStartReqFromJSON = TomoIdvStartReqFromJSON;
exports.TomoIdvStartReqFromJSONTyped = TomoIdvStartReqFromJSONTyped;
exports.TomoIdvStartReqToJSON = TomoIdvStartReqToJSON;
exports.TomoIdvStartReqToJSONTyped = TomoIdvStartReqToJSONTyped;
function instanceOfTomoIdvStartReq(value) {
    if (!('redirectUrl' in value) || value['redirectUrl'] === undefined)
        return false;
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function TomoIdvStartReqFromJSON(json) {
    return TomoIdvStartReqFromJSONTyped(json, false);
}
function TomoIdvStartReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'redirectUrl': json['redirect_url'],
        'userId': json['user_id'],
    };
}
function TomoIdvStartReqToJSON(json) {
    return TomoIdvStartReqToJSONTyped(json, false);
}
function TomoIdvStartReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'redirect_url': value['redirectUrl'],
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=TomoIdvStartReq.js.map