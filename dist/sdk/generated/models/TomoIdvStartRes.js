"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvStartRes = instanceOfTomoIdvStartRes;
exports.TomoIdvStartResFromJSON = TomoIdvStartResFromJSON;
exports.TomoIdvStartResFromJSONTyped = TomoIdvStartResFromJSONTyped;
exports.TomoIdvStartResToJSON = TomoIdvStartResToJSON;
function instanceOfTomoIdvStartRes(value) {
    let isInstance = true;
    isInstance = isInstance && "startIdvUri" in value;
    return isInstance;
}
function TomoIdvStartResFromJSON(json) {
    return TomoIdvStartResFromJSONTyped(json, false);
}
function TomoIdvStartResFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function TomoIdvStartResToJSON(value) {
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
//# sourceMappingURL=TomoIdvStartRes.js.map