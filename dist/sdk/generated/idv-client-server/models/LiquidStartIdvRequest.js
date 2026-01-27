"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLiquidStartIdvRequest = instanceOfLiquidStartIdvRequest;
exports.LiquidStartIdvRequestFromJSON = LiquidStartIdvRequestFromJSON;
exports.LiquidStartIdvRequestFromJSONTyped = LiquidStartIdvRequestFromJSONTyped;
exports.LiquidStartIdvRequestToJSON = LiquidStartIdvRequestToJSON;
function instanceOfLiquidStartIdvRequest(value) {
    let isInstance = true;
    isInstance = isInstance && "callbackUrl" in value;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function LiquidStartIdvRequestFromJSON(json) {
    return LiquidStartIdvRequestFromJSONTyped(json, false);
}
function LiquidStartIdvRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'userId': json['user_id'],
    };
}
function LiquidStartIdvRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'callback_url': value.callbackUrl,
        'user_id': value.userId,
    };
}
//# sourceMappingURL=LiquidStartIdvRequest.js.map