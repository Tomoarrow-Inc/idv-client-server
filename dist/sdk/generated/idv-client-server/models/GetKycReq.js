"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfGetKycReq = instanceOfGetKycReq;
exports.GetKycReqFromJSON = GetKycReqFromJSON;
exports.GetKycReqFromJSONTyped = GetKycReqFromJSONTyped;
exports.GetKycReqToJSON = GetKycReqToJSON;
exports.GetKycReqToJSONTyped = GetKycReqToJSONTyped;
const Country_1 = require("./Country");
function instanceOfGetKycReq(value) {
    if (!('country' in value) || value['country'] === undefined)
        return false;
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function GetKycReqFromJSON(json) {
    return GetKycReqFromJSONTyped(json, false);
}
function GetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'country': (0, Country_1.CountryFromJSON)(json['country']),
        'userId': json['user_id'],
    };
}
function GetKycReqToJSON(json) {
    return GetKycReqToJSONTyped(json, false);
}
function GetKycReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'country': (0, Country_1.CountryToJSON)(value['country']),
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=GetKycReq.js.map