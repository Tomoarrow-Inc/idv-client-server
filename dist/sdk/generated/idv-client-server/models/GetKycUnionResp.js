"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespFromJSON = GetKycUnionRespFromJSON;
exports.GetKycUnionRespFromJSONTyped = GetKycUnionRespFromJSONTyped;
exports.GetKycUnionRespToJSON = GetKycUnionRespToJSON;
exports.GetKycUnionRespToJSONTyped = GetKycUnionRespToJSONTyped;
const LiquidGetKycResp_1 = require("./LiquidGetKycResp");
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
    return {};
}
//# sourceMappingURL=GetKycUnionResp.js.map