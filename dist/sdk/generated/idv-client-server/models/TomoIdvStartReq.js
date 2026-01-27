"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvStartReq = instanceOfTomoIdvStartReq;
exports.TomoIdvStartReqFromJSON = TomoIdvStartReqFromJSON;
exports.TomoIdvStartReqFromJSONTyped = TomoIdvStartReqFromJSONTyped;
exports.TomoIdvStartReqToJSON = TomoIdvStartReqToJSON;
function instanceOfTomoIdvStartReq(value) {
    let isInstance = true;
    isInstance = isInstance && "redirectUrl" in value;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function TomoIdvStartReqFromJSON(json) {
    return TomoIdvStartReqFromJSONTyped(json, false);
}
function TomoIdvStartReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'redirectUrl': json['redirect_url'],
        'userId': json['user_id'],
    };
}
function TomoIdvStartReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'redirect_url': value.redirectUrl,
        'user_id': value.userId,
    };
}
//# sourceMappingURL=TomoIdvStartReq.js.map