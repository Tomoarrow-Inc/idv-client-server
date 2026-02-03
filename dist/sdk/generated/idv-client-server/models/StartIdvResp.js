"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfStartIdvResp = instanceOfStartIdvResp;
exports.StartIdvRespFromJSON = StartIdvRespFromJSON;
exports.StartIdvRespFromJSONTyped = StartIdvRespFromJSONTyped;
exports.StartIdvRespToJSON = StartIdvRespToJSON;
exports.StartIdvRespToJSONTyped = StartIdvRespToJSONTyped;
function instanceOfStartIdvResp(value) {
    if (!('startIdvUri' in value) || value['startIdvUri'] === undefined)
        return false;
    return true;
}
function StartIdvRespFromJSON(json) {
    return StartIdvRespFromJSONTyped(json, false);
}
function StartIdvRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function StartIdvRespToJSON(json) {
    return StartIdvRespToJSONTyped(json, false);
}
function StartIdvRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'start_idv_uri': value['startIdvUri'],
    };
}
//# sourceMappingURL=StartIdvResp.js.map