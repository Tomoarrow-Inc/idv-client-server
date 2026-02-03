"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidGetKycResp = instanceOfLiquidGetKycResp;
exports.LiquidGetKycRespFromJSON = LiquidGetKycRespFromJSON;
exports.LiquidGetKycRespFromJSONTyped = LiquidGetKycRespFromJSONTyped;
exports.LiquidGetKycRespToJSON = LiquidGetKycRespToJSON;
exports.LiquidGetKycRespToJSONTyped = LiquidGetKycRespToJSONTyped;
function instanceOfLiquidGetKycResp(value) {
    if (!('address' in value) || value['address'] === undefined)
        return false;
    if (!('dateOfBirth' in value) || value['dateOfBirth'] === undefined)
        return false;
    if (!('name' in value) || value['name'] === undefined)
        return false;
    if (!('sex' in value) || value['sex'] === undefined)
        return false;
    return true;
}
function LiquidGetKycRespFromJSON(json) {
    return LiquidGetKycRespFromJSONTyped(json, false);
}
function LiquidGetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'address': json['address'],
        'dateOfBirth': json['date_of_birth'],
        'name': json['name'],
        'postalCode': json['postal_code'] == null ? undefined : json['postal_code'],
        'sex': json['sex'],
    };
}
function LiquidGetKycRespToJSON(json) {
    return LiquidGetKycRespToJSONTyped(json, false);
}
function LiquidGetKycRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'address': value['address'],
        'date_of_birth': value['dateOfBirth'],
        'name': value['name'],
        'postal_code': value['postalCode'],
        'sex': value['sex'],
    };
}
//# sourceMappingURL=LiquidGetKycResp.js.map