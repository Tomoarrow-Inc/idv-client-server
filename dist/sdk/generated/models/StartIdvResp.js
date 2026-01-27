"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfStartIdvResp = instanceOfStartIdvResp;
exports.StartIdvRespFromJSON = StartIdvRespFromJSON;
exports.StartIdvRespFromJSONTyped = StartIdvRespFromJSONTyped;
exports.StartIdvRespToJSON = StartIdvRespToJSON;
function instanceOfStartIdvResp(value) {
    let isInstance = true;
    isInstance = isInstance && "startIdvUri" in value;
    return isInstance;
}
function StartIdvRespFromJSON(json) {
    return StartIdvRespFromJSONTyped(json, false);
}
function StartIdvRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function StartIdvRespToJSON(value) {
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
//# sourceMappingURL=StartIdvResp.js.map