"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidGetKycReq = instanceOfLiquidGetKycReq;
exports.LiquidGetKycReqFromJSON = LiquidGetKycReqFromJSON;
exports.LiquidGetKycReqFromJSONTyped = LiquidGetKycReqFromJSONTyped;
exports.LiquidGetKycReqToJSON = LiquidGetKycReqToJSON;
exports.LiquidGetKycReqToJSONTyped = LiquidGetKycReqToJSONTyped;
const LiquidIdvField_1 = require("./LiquidIdvField");
function instanceOfLiquidGetKycReq(value) {
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function LiquidGetKycReqFromJSON(json) {
    return LiquidGetKycReqFromJSONTyped(json, false);
}
function LiquidGetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'fields': json['fields'] == null ? undefined : (json['fields'].map(LiquidIdvField_1.LiquidIdvFieldFromJSON)),
        'userId': json['user_id'],
    };
}
function LiquidGetKycReqToJSON(json) {
    return LiquidGetKycReqToJSONTyped(json, false);
}
function LiquidGetKycReqToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'fields': value['fields'] == null ? undefined : (value['fields'].map(LiquidIdvField_1.LiquidIdvFieldToJSON)),
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=LiquidGetKycReq.js.map