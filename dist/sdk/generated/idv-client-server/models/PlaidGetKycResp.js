"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPlaidGetKycResp = instanceOfPlaidGetKycResp;
exports.PlaidGetKycRespFromJSON = PlaidGetKycRespFromJSON;
exports.PlaidGetKycRespFromJSONTyped = PlaidGetKycRespFromJSONTyped;
exports.PlaidGetKycRespToJSON = PlaidGetKycRespToJSON;
function instanceOfPlaidGetKycResp(value) {
    let isInstance = true;
    isInstance = isInstance && "city" in value;
    isInstance = isInstance && "country" in value;
    isInstance = isInstance && "dateOfBirth" in value;
    isInstance = isInstance && "emailAddress" in value;
    isInstance = isInstance && "familyName" in value;
    isInstance = isInstance && "givenName" in value;
    isInstance = isInstance && "phoneNumber" in value;
    isInstance = isInstance && "postalCode" in value;
    isInstance = isInstance && "region" in value;
    isInstance = isInstance && "street" in value;
    return isInstance;
}
function PlaidGetKycRespFromJSON(json) {
    return PlaidGetKycRespFromJSONTyped(json, false);
}
function PlaidGetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
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
function PlaidGetKycRespToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'city': value.city,
        'country': value.country,
        'date_of_birth': value.dateOfBirth,
        'email_address': value.emailAddress,
        'family_name': value.familyName,
        'given_name': value.givenName,
        'phone_number': value.phoneNumber,
        'postal_code': value.postalCode,
        'region': value.region,
        'street': value.street,
    };
}
//# sourceMappingURL=PlaidGetKycResp.js.map