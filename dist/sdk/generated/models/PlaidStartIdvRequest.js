"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidStartIdvRequest = instanceOfPlaidStartIdvRequest;
exports.PlaidStartIdvRequestFromJSON = PlaidStartIdvRequestFromJSON;
exports.PlaidStartIdvRequestFromJSONTyped = PlaidStartIdvRequestFromJSONTyped;
exports.PlaidStartIdvRequestToJSON = PlaidStartIdvRequestToJSON;
function instanceOfPlaidStartIdvRequest(value) {
    let isInstance = true;
    isInstance = isInstance && "callbackUrl" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "userId" in value;
    return isInstance;
}
function PlaidStartIdvRequestFromJSON(json) {
    return PlaidStartIdvRequestFromJSONTyped(json, false);
}
function PlaidStartIdvRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'email': json['email'],
        'userId': json['user_id'],
    };
}
function PlaidStartIdvRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'callback_url': value.callbackUrl,
        'email': value.email,
        'user_id': value.userId,
    };
}
//# sourceMappingURL=PlaidStartIdvRequest.js.map