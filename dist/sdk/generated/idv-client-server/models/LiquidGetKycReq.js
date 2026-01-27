"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidGetKycReq = instanceOfLiquidGetKycReq;
exports.LiquidGetKycReqFromJSON = LiquidGetKycReqFromJSON;
exports.LiquidGetKycReqFromJSONTyped = LiquidGetKycReqFromJSONTyped;
exports.LiquidGetKycReqToJSON = LiquidGetKycReqToJSON;
const runtime_1 = require("../runtime");
const LiquidIdvField_1 = require("./LiquidIdvField");
function instanceOfLiquidGetKycReq(value) {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function LiquidGetKycReqFromJSON(json) {
    return LiquidGetKycReqFromJSONTyped(json, false);
}
function LiquidGetKycReqFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'fields': !(0, runtime_1.exists)(json, 'fields') ? undefined : (json['fields'].map(LiquidIdvField_1.LiquidIdvFieldFromJSON)),
        'userId': json['user_id'],
    };
}
function LiquidGetKycReqToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'fields': value.fields === undefined ? undefined : (value.fields.map(LiquidIdvField_1.LiquidIdvFieldToJSON)),
        'user_id': value.userId,
    };
}
//# sourceMappingURL=LiquidGetKycReq.js.map