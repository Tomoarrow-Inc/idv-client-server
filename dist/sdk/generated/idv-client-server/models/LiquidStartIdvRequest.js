"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidStartIdvRequest = instanceOfLiquidStartIdvRequest;
exports.LiquidStartIdvRequestFromJSON = LiquidStartIdvRequestFromJSON;
exports.LiquidStartIdvRequestFromJSONTyped = LiquidStartIdvRequestFromJSONTyped;
exports.LiquidStartIdvRequestToJSON = LiquidStartIdvRequestToJSON;
exports.LiquidStartIdvRequestToJSONTyped = LiquidStartIdvRequestToJSONTyped;
function instanceOfLiquidStartIdvRequest(value) {
    if (!('callbackUrl' in value) || value['callbackUrl'] === undefined)
        return false;
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function LiquidStartIdvRequestFromJSON(json) {
    return LiquidStartIdvRequestFromJSONTyped(json, false);
}
function LiquidStartIdvRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'userId': json['user_id'],
    };
}
function LiquidStartIdvRequestToJSON(json) {
    return LiquidStartIdvRequestToJSONTyped(json, false);
}
function LiquidStartIdvRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'callback_url': value['callbackUrl'],
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=LiquidStartIdvRequest.js.map