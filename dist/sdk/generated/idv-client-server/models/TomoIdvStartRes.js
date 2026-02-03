"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTomoIdvStartRes = instanceOfTomoIdvStartRes;
exports.TomoIdvStartResFromJSON = TomoIdvStartResFromJSON;
exports.TomoIdvStartResFromJSONTyped = TomoIdvStartResFromJSONTyped;
exports.TomoIdvStartResToJSON = TomoIdvStartResToJSON;
exports.TomoIdvStartResToJSONTyped = TomoIdvStartResToJSONTyped;
function instanceOfTomoIdvStartRes(value) {
    if (!('startIdvUri' in value) || value['startIdvUri'] === undefined)
        return false;
    return true;
}
function TomoIdvStartResFromJSON(json) {
    return TomoIdvStartResFromJSONTyped(json, false);
}
function TomoIdvStartResFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function TomoIdvStartResToJSON(json) {
    return TomoIdvStartResToJSONTyped(json, false);
}
function TomoIdvStartResToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'start_idv_uri': value['startIdvUri'],
    };
}
//# sourceMappingURL=TomoIdvStartRes.js.map