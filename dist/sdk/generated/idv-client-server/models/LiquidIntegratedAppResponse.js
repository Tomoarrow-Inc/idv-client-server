"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidIntegratedAppResponse = instanceOfLiquidIntegratedAppResponse;
exports.LiquidIntegratedAppResponseFromJSON = LiquidIntegratedAppResponseFromJSON;
exports.LiquidIntegratedAppResponseFromJSONTyped = LiquidIntegratedAppResponseFromJSONTyped;
exports.LiquidIntegratedAppResponseToJSON = LiquidIntegratedAppResponseToJSON;
exports.LiquidIntegratedAppResponseToJSONTyped = LiquidIntegratedAppResponseToJSONTyped;
function instanceOfLiquidIntegratedAppResponse(value) {
    if (!('startIdvUri' in value) || value['startIdvUri'] === undefined)
        return false;
    return true;
}
function LiquidIntegratedAppResponseFromJSON(json) {
    return LiquidIntegratedAppResponseFromJSONTyped(json, false);
}
function LiquidIntegratedAppResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function LiquidIntegratedAppResponseToJSON(json) {
    return LiquidIntegratedAppResponseToJSONTyped(json, false);
}
function LiquidIntegratedAppResponseToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'start_idv_uri': value['startIdvUri'],
    };
}
//# sourceMappingURL=LiquidIntegratedAppResponse.js.map