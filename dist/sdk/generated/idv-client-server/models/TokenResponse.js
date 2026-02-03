"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTokenResponse = instanceOfTokenResponse;
exports.TokenResponseFromJSON = TokenResponseFromJSON;
exports.TokenResponseFromJSONTyped = TokenResponseFromJSONTyped;
exports.TokenResponseToJSON = TokenResponseToJSON;
exports.TokenResponseToJSONTyped = TokenResponseToJSONTyped;
function instanceOfTokenResponse(value) {
    if (!('accessToken' in value) || value['accessToken'] === undefined)
        return false;
    if (!('expiresIn' in value) || value['expiresIn'] === undefined)
        return false;
    if (!('tokenType' in value) || value['tokenType'] === undefined)
        return false;
    return true;
}
function TokenResponseFromJSON(json) {
    return TokenResponseFromJSONTyped(json, false);
}
function TokenResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'accessToken': json['access_token'],
        'expiresIn': json['expires_in'],
        'scope': json['scope'] == null ? undefined : json['scope'],
        'tokenType': json['token_type'],
    };
}
function TokenResponseToJSON(json) {
    return TokenResponseToJSONTyped(json, false);
}
function TokenResponseToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'access_token': value['accessToken'],
        'expires_in': value['expiresIn'],
        'scope': value['scope'],
        'token_type': value['tokenType'],
    };
}
//# sourceMappingURL=TokenResponse.js.map