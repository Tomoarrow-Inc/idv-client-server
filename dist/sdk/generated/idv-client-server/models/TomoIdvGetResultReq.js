"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvGetResultReq = instanceOfTomoIdvGetResultReq;
exports.TomoIdvGetResultReqFromJSON = TomoIdvGetResultReqFromJSON;
exports.TomoIdvGetResultReqFromJSONTyped = TomoIdvGetResultReqFromJSONTyped;
exports.TomoIdvGetResultReqToJSON = TomoIdvGetResultReqToJSON;
exports.TomoIdvGetResultReqToJSONTyped = TomoIdvGetResultReqToJSONTyped;
function instanceOfTomoIdvGetResultReq(value) {
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function TomoIdvGetResultReqFromJSON(json) {
    return TomoIdvGetResultReqFromJSONTyped(json, false);
}
function TomoIdvGetResultReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'userId': json['user_id'],
    };
}
function TomoIdvGetResultReqToJSON(json) {
    return TomoIdvGetResultReqToJSONTyped(json, false);
}
function TomoIdvGetResultReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=TomoIdvGetResultReq.js.map