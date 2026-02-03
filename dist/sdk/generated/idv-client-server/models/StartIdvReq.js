"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfStartIdvReq = instanceOfStartIdvReq;
exports.StartIdvReqFromJSON = StartIdvReqFromJSON;
exports.StartIdvReqFromJSONTyped = StartIdvReqFromJSONTyped;
exports.StartIdvReqToJSON = StartIdvReqToJSON;
exports.StartIdvReqToJSONTyped = StartIdvReqToJSONTyped;
const Country_1 = require("./Country");
function instanceOfStartIdvReq(value) {
    if (!('callbackUrl' in value) || value['callbackUrl'] === undefined)
        return false;
    if (!('email' in value) || value['email'] === undefined)
        return false;
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function StartIdvReqFromJSON(json) {
    return StartIdvReqFromJSONTyped(json, false);
}
function StartIdvReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'country': json['country'] == null ? undefined : (0, Country_1.CountryFromJSON)(json['country']),
        'email': json['email'],
        'userId': json['user_id'],
    };
}
function StartIdvReqToJSON(json) {
    return StartIdvReqToJSONTyped(json, false);
}
function StartIdvReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'callback_url': value['callbackUrl'],
        'country': (0, Country_1.CountryToJSON)(value['country']),
        'email': value['email'],
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=StartIdvReq.js.map