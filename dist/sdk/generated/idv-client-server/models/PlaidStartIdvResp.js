"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidStartIdvResp = instanceOfPlaidStartIdvResp;
exports.PlaidStartIdvRespFromJSON = PlaidStartIdvRespFromJSON;
exports.PlaidStartIdvRespFromJSONTyped = PlaidStartIdvRespFromJSONTyped;
exports.PlaidStartIdvRespToJSON = PlaidStartIdvRespToJSON;
exports.PlaidStartIdvRespToJSONTyped = PlaidStartIdvRespToJSONTyped;
function instanceOfPlaidStartIdvResp(value) {
    if (!('startIdvUri' in value) || value['startIdvUri'] === undefined)
        return false;
    return true;
}
function PlaidStartIdvRespFromJSON(json) {
    return PlaidStartIdvRespFromJSONTyped(json, false);
}
function PlaidStartIdvRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'startIdvUri': json['start_idv_uri'],
    };
}
function PlaidStartIdvRespToJSON(json) {
    return PlaidStartIdvRespToJSONTyped(json, false);
}
function PlaidStartIdvRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'start_idv_uri': value['startIdvUri'],
    };
}
//# sourceMappingURL=PlaidStartIdvResp.js.map