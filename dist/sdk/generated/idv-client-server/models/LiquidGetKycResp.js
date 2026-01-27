"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidGetKycResp = instanceOfLiquidGetKycResp;
exports.LiquidGetKycRespFromJSON = LiquidGetKycRespFromJSON;
exports.LiquidGetKycRespFromJSONTyped = LiquidGetKycRespFromJSONTyped;
exports.LiquidGetKycRespToJSON = LiquidGetKycRespToJSON;
const runtime_1 = require("../runtime");
function instanceOfLiquidGetKycResp(value) {
    let isInstance = true;
    isInstance = isInstance && "address" in value;
    isInstance = isInstance && "dateOfBirth" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "sex" in value;
    return isInstance;
}
function LiquidGetKycRespFromJSON(json) {
    return LiquidGetKycRespFromJSONTyped(json, false);
}
function LiquidGetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'address': json['address'],
        'dateOfBirth': json['date_of_birth'],
        'name': json['name'],
        'postalCode': !(0, runtime_1.exists)(json, 'postal_code') ? undefined : json['postal_code'],
        'sex': json['sex'],
    };
}
function LiquidGetKycRespToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'address': value.address,
        'date_of_birth': value.dateOfBirth,
        'name': value.name,
        'postal_code': value.postalCode,
        'sex': value.sex,
    };
}
//# sourceMappingURL=LiquidGetKycResp.js.map