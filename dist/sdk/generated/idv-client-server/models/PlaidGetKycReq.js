"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidGetKycReq = instanceOfPlaidGetKycReq;
exports.PlaidGetKycReqFromJSON = PlaidGetKycReqFromJSON;
exports.PlaidGetKycReqFromJSONTyped = PlaidGetKycReqFromJSONTyped;
exports.PlaidGetKycReqToJSON = PlaidGetKycReqToJSON;
exports.PlaidGetKycReqToJSONTyped = PlaidGetKycReqToJSONTyped;
const PlaidIdvField_1 = require("./PlaidIdvField");
function instanceOfPlaidGetKycReq(value) {
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function PlaidGetKycReqFromJSON(json) {
    return PlaidGetKycReqFromJSONTyped(json, false);
}
function PlaidGetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'fields': json['fields'] == null ? undefined : (json['fields'].map(PlaidIdvField_1.PlaidIdvFieldFromJSON)),
        'userId': json['user_id'],
    };
}
function PlaidGetKycReqToJSON(json) {
    return PlaidGetKycReqToJSONTyped(json, false);
}
function PlaidGetKycReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'fields': value['fields'] == null ? undefined : (value['fields'].map(PlaidIdvField_1.PlaidIdvFieldToJSON)),
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=PlaidGetKycReq.js.map