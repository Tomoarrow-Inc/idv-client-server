"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfGetKycReq = instanceOfGetKycReq;
exports.GetKycReqFromJSON = GetKycReqFromJSON;
exports.GetKycReqFromJSONTyped = GetKycReqFromJSONTyped;
exports.GetKycReqToJSON = GetKycReqToJSON;
const Country_1 = require("./Country");
function instanceOfGetKycReq(value) {
    let isInstance = true;
    isInstance = isInstance && "country" in value;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function GetKycReqFromJSON(json) {
    return GetKycReqFromJSONTyped(json, false);
}
function GetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'country': (0, Country_1.CountryFromJSON)(json['country']),
        'userId': json['user_id'],
    };
}
function GetKycReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'country': (0, Country_1.CountryToJSON)(value.country),
        'user_id': value.userId,
    };
}
//# sourceMappingURL=GetKycReq.js.map