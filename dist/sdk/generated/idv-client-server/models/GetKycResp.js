"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfGetKycResp = instanceOfGetKycResp;
exports.GetKycRespFromJSON = GetKycRespFromJSON;
exports.GetKycRespFromJSONTyped = GetKycRespFromJSONTyped;
exports.GetKycRespToJSON = GetKycRespToJSON;
exports.GetKycRespToJSONTyped = GetKycRespToJSONTyped;
function instanceOfGetKycResp(value) {
    if (!('country' in value) || value['country'] === undefined)
        return false;
    if (!('dateOfBirth' in value) || value['dateOfBirth'] === undefined)
        return false;
    if (!('fullAddress' in value) || value['fullAddress'] === undefined)
        return false;
    if (!('fullName' in value) || value['fullName'] === undefined)
        return false;
    return true;
}
function GetKycRespFromJSON(json) {
    return GetKycRespFromJSONTyped(json, false);
}
function GetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'city': json['city'] == null ? undefined : json['city'],
        'country': json['country'],
        'dateOfBirth': json['date_of_birth'],
        'emailAddress': json['email_address'] == null ? undefined : json['email_address'],
        'familyName': json['family_name'] == null ? undefined : json['family_name'],
        'fullAddress': json['full_address'],
        'fullName': json['full_name'],
        'givenName': json['given_name'] == null ? undefined : json['given_name'],
        'phoneNumber': json['phone_number'] == null ? undefined : json['phone_number'],
        'postalCode': json['postal_code'] == null ? undefined : json['postal_code'],
        'region': json['region'] == null ? undefined : json['region'],
        'sex': json['sex'] == null ? undefined : json['sex'],
        'street': json['street'] == null ? undefined : json['street'],
    };
}
function GetKycRespToJSON(json) {
    return GetKycRespToJSONTyped(json, false);
}
function GetKycRespToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'city': value['city'],
        'country': value['country'],
        'date_of_birth': value['dateOfBirth'],
        'email_address': value['emailAddress'],
        'family_name': value['familyName'],
        'full_address': value['fullAddress'],
        'full_name': value['fullName'],
        'given_name': value['givenName'],
        'phone_number': value['phoneNumber'],
        'postal_code': value['postalCode'],
        'region': value['region'],
        'sex': value['sex'],
        'street': value['street'],
    };
}
//# sourceMappingURL=GetKycResp.js.map