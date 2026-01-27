"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTokenResponse = instanceOfTokenResponse;
exports.TokenResponseFromJSON = TokenResponseFromJSON;
exports.TokenResponseFromJSONTyped = TokenResponseFromJSONTyped;
exports.TokenResponseToJSON = TokenResponseToJSON;
const runtime_1 = require("../runtime");
function instanceOfTokenResponse(value) {
    let isInstance = true;
    isInstance = isInstance && "accessToken" in value;
    isInstance = isInstance && "expiresIn" in value;
    isInstance = isInstance && "tokenType" in value;
    return isInstance;
}
function TokenResponseFromJSON(json) {
    return TokenResponseFromJSONTyped(json, false);
}
function TokenResponseFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'accessToken': json['access_token'],
        'expiresIn': json['expires_in'],
        'scope': !(0, runtime_1.exists)(json, 'scope') ? undefined : json['scope'],
        'tokenType': json['token_type'],
    };
}
function TokenResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'access_token': value.accessToken,
        'expires_in': value.expiresIn,
        'scope': value.scope,
        'token_type': value.tokenType,
    };
}
//# sourceMappingURL=TokenResponse.js.map