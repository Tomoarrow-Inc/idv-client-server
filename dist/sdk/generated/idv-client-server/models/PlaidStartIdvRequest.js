"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidStartIdvRequest = instanceOfPlaidStartIdvRequest;
exports.PlaidStartIdvRequestFromJSON = PlaidStartIdvRequestFromJSON;
exports.PlaidStartIdvRequestFromJSONTyped = PlaidStartIdvRequestFromJSONTyped;
exports.PlaidStartIdvRequestToJSON = PlaidStartIdvRequestToJSON;
exports.PlaidStartIdvRequestToJSONTyped = PlaidStartIdvRequestToJSONTyped;
function instanceOfPlaidStartIdvRequest(value) {
    if (!('callbackUrl' in value) || value['callbackUrl'] === undefined)
        return false;
    if (!('email' in value) || value['email'] === undefined)
        return false;
    if (!('userId' in value) || value['userId'] === undefined)
        return false;
    return true;
}
function PlaidStartIdvRequestFromJSON(json) {
    return PlaidStartIdvRequestFromJSONTyped(json, false);
}
function PlaidStartIdvRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'callbackUrl': json['callback_url'],
        'email': json['email'],
        'userId': json['user_id'],
    };
}
function PlaidStartIdvRequestToJSON(json) {
    return PlaidStartIdvRequestToJSONTyped(json, false);
}
function PlaidStartIdvRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'callback_url': value['callbackUrl'],
        'email': value['email'],
        'user_id': value['userId'],
    };
}
//# sourceMappingURL=PlaidStartIdvRequest.js.map