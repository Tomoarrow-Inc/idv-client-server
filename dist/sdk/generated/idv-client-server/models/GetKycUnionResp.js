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
    const hasPlaidSnake = typeof json === 'object' && ('date_of_birth' in json || 'given_name' in json) && ('city' in json || 'country' in json);
    const hasLiquidSnake = typeof json === 'object' && ('name' in json || 'date_of_birth' in json) && 'address' in json;
    const hasAnyLiquidKey = typeof json === 'object' && ('name' in json || 'date_of_birth' in json || 'address' in json || 'sex' in json || 'postal_code' in json);
    const hasNoPlaidKey = typeof json === 'object' && !('given_name' in json) && !('city' in json);
    if (hasPlaidSnake) {
        return (0, PlaidGetKycResp_1.PlaidGetKycRespFromJSONTyped)(json, true);
    }
    if (hasLiquidSnake || (hasAnyLiquidKey && hasNoPlaidKey)) {
        return (0, LiquidGetKycResp_1.LiquidGetKycRespFromJSONTyped)(json, true);
    }
    return json;
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