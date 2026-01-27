"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfStartIdvReq = instanceOfStartIdvReq;
exports.StartIdvReqFromJSON = StartIdvReqFromJSON;
exports.StartIdvReqFromJSONTyped = StartIdvReqFromJSONTyped;
exports.StartIdvReqToJSON = StartIdvReqToJSON;
const runtime_1 = require("../runtime");
const Country_1 = require("./Country");
function instanceOfStartIdvReq(value) {
    let isInstance = true;
    isInstance = isInstance && "callbackUrl" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function StartIdvReqFromJSON(json) {
    return StartIdvReqFromJSONTyped(json, false);
}
function StartIdvReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'country': !(0, runtime_1.exists)(json, 'country') ? undefined : (0, Country_1.CountryFromJSON)(json['country']),
        'email': json['email'],
        'userId': json['user_id'],
    };
}
function StartIdvReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'callback_url': value.callbackUrl,
        'country': (0, Country_1.CountryToJSON)(value.country),
        'email': value.email,
        'user_id': value.userId,
    };
}
//# sourceMappingURL=StartIdvReq.js.map