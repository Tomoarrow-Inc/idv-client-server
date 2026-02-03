"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidGetKycResp = instanceOfPlaidGetKycResp;
exports.PlaidGetKycRespFromJSON = PlaidGetKycRespFromJSON;
exports.PlaidGetKycRespFromJSONTyped = PlaidGetKycRespFromJSONTyped;
exports.PlaidGetKycRespToJSON = PlaidGetKycRespToJSON;
exports.PlaidGetKycRespToJSONTyped = PlaidGetKycRespToJSONTyped;
function instanceOfPlaidGetKycResp(value) {
    if (!('city' in value) || value['city'] === undefined)
        return false;
    if (!('country' in value) || value['country'] === undefined)
        return false;
    if (!('dateOfBirth' in value) || value['dateOfBirth'] === undefined)
        return false;
    if (!('emailAddress' in value) || value['emailAddress'] === undefined)
        return false;
    if (!('familyName' in value) || value['familyName'] === undefined)
        return false;
    if (!('givenName' in value) || value['givenName'] === undefined)
        return false;
    if (!('phoneNumber' in value) || value['phoneNumber'] === undefined)
        return false;
    if (!('postalCode' in value) || value['postalCode'] === undefined)
        return false;
    if (!('region' in value) || value['region'] === undefined)
        return false;
    if (!('street' in value) || value['street'] === undefined)
        return false;
    return true;
}
function PlaidGetKycRespFromJSON(json) {
    return PlaidGetKycRespFromJSONTyped(json, false);
}
function PlaidGetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'city': json['city'],
        'country': json['country'],
        'dateOfBirth': json['date_of_birth'],
        'emailAddress': json['email_address'],
        'familyName': json['family_name'],
        'givenName': json['given_name'],
        'phoneNumber': json['phone_number'],
        'postalCode': json['postal_code'],
        'region': json['region'],
        'street': json['street'],
    };
}
function PlaidGetKycRespToJSON(json) {
    return PlaidGetKycRespToJSONTyped(json, false);
}
function PlaidGetKycRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'city': value['city'],
        'country': value['country'],
        'date_of_birth': value['dateOfBirth'],
        'email_address': value['emailAddress'],
        'family_name': value['familyName'],
        'given_name': value['givenName'],
        'phone_number': value['phoneNumber'],
        'postal_code': value['postalCode'],
        'region': value['region'],
        'street': value['street'],
    };
}
//# sourceMappingURL=PlaidGetKycResp.js.map