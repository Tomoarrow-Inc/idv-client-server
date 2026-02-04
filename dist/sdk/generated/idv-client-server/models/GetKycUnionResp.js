"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespFromJSON = GetKycUnionRespFromJSON;
exports.GetKycUnionRespFromJSONTyped = GetKycUnionRespFromJSONTyped;
exports.GetKycUnionRespToJSON = GetKycUnionRespToJSON;
exports.GetKycUnionRespToJSONTyped = GetKycUnionRespToJSONTyped;
const LiquidGetKycResp_1 = require("./LiquidGetKycResp");
const PlaidGetKycResp_1 = require("./PlaidGetKycResp");
function GetKycUnionRespFromJSON(json) {
    return GetKycUnionRespFromJSONTyped(json, false);
}
function GetKycUnionRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    if (typeof json !== 'object') {
        return json;
    }
    if ((0, LiquidGetKycResp_1.instanceOfLiquidGetKycResp)(json)) {
        return (0, LiquidGetKycResp_1.LiquidGetKycRespFromJSONTyped)(json, true);
    }
    if ((0, PlaidGetKycResp_1.instanceOfPlaidGetKycResp)(json)) {
        return (0, PlaidGetKycResp_1.PlaidGetKycRespFromJSONTyped)(json, true);
    }
    return {};
}
function GetKycUnionRespToJSON(json) {
    return GetKycUnionRespToJSONTyped(json, false);
}
function GetKycUnionRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    if (typeof value !== 'object') {
        return value;
    }
    if ((0, LiquidGetKycResp_1.instanceOfLiquidGetKycResp)(value)) {
        return (0, LiquidGetKycResp_1.LiquidGetKycRespToJSON)(value);
    }
    if ((0, PlaidGetKycResp_1.instanceOfPlaidGetKycResp)(value)) {
        return (0, PlaidGetKycResp_1.PlaidGetKycRespToJSON)(value);
    }
    return {};
}
//# sourceMappingURL=GetKycUnionResp.js.map