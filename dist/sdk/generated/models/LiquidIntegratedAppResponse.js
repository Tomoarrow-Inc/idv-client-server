"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidIntegratedAppResponse = instanceOfLiquidIntegratedAppResponse;
exports.LiquidIntegratedAppResponseFromJSON = LiquidIntegratedAppResponseFromJSON;
exports.LiquidIntegratedAppResponseFromJSONTyped = LiquidIntegratedAppResponseFromJSONTyped;
exports.LiquidIntegratedAppResponseToJSON = LiquidIntegratedAppResponseToJSON;
function instanceOfLiquidIntegratedAppResponse(value) {
    let isInstance = true;
    isInstance = isInstance && "startIdvUri" in value;
    return isInstance;
}
function LiquidIntegratedAppResponseFromJSON(json) {
    return LiquidIntegratedAppResponseFromJSONTyped(json, false);
}
function LiquidIntegratedAppResponseFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function LiquidIntegratedAppResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'start_idv_uri': value.startIdvUri,
    };
}
//# sourceMappingURL=LiquidIntegratedAppResponse.js.map