"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvGetResultReq = instanceOfTomoIdvGetResultReq;
exports.TomoIdvGetResultReqFromJSON = TomoIdvGetResultReqFromJSON;
exports.TomoIdvGetResultReqFromJSONTyped = TomoIdvGetResultReqFromJSONTyped;
exports.TomoIdvGetResultReqToJSON = TomoIdvGetResultReqToJSON;
function instanceOfTomoIdvGetResultReq(value) {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function TomoIdvGetResultReqFromJSON(json) {
    return TomoIdvGetResultReqFromJSONTyped(json, false);
}
function TomoIdvGetResultReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'userId': json['user_id'],
    };
}
function TomoIdvGetResultReqToJSON(value) {
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
//# sourceMappingURL=TomoIdvGetResultReq.js.map