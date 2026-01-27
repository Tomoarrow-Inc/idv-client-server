"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidStartIdvResp = instanceOfPlaidStartIdvResp;
exports.PlaidStartIdvRespFromJSON = PlaidStartIdvRespFromJSON;
exports.PlaidStartIdvRespFromJSONTyped = PlaidStartIdvRespFromJSONTyped;
exports.PlaidStartIdvRespToJSON = PlaidStartIdvRespToJSON;
function instanceOfPlaidStartIdvResp(value) {
    let isInstance = true;
    isInstance = isInstance && "startIdvUri" in value;
    return isInstance;
}
function PlaidStartIdvRespFromJSON(json) {
    return PlaidStartIdvRespFromJSONTyped(json, false);
}
function PlaidStartIdvRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function PlaidStartIdvRespToJSON(value) {
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
//# sourceMappingURL=PlaidStartIdvResp.js.map