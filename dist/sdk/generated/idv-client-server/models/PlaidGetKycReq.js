"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidGetKycReq = instanceOfPlaidGetKycReq;
exports.PlaidGetKycReqFromJSON = PlaidGetKycReqFromJSON;
exports.PlaidGetKycReqFromJSONTyped = PlaidGetKycReqFromJSONTyped;
exports.PlaidGetKycReqToJSON = PlaidGetKycReqToJSON;
const runtime_1 = require("../runtime");
const PlaidIdvField_1 = require("./PlaidIdvField");
function instanceOfPlaidGetKycReq(value) {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function PlaidGetKycReqFromJSON(json) {
    return PlaidGetKycReqFromJSONTyped(json, false);
}
function PlaidGetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'fields': !(0, runtime_1.exists)(json, 'fields') ? undefined : (json['fields'].map(PlaidIdvField_1.PlaidIdvFieldFromJSON)),
        'userId': json['user_id'],
    };
}
function PlaidGetKycReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'fields': value.fields === undefined ? undefined : (value.fields.map(PlaidIdvField_1.PlaidIdvFieldToJSON)),
        'user_id': value.userId,
    };
}
//# sourceMappingURL=PlaidGetKycReq.js.map