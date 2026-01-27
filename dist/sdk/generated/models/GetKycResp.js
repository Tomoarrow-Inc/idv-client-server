"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfGetKycResp = instanceOfGetKycResp;
exports.GetKycRespFromJSON = GetKycRespFromJSON;
exports.GetKycRespFromJSONTyped = GetKycRespFromJSONTyped;
exports.GetKycRespToJSON = GetKycRespToJSON;
const runtime_1 = require("../runtime");
function instanceOfGetKycResp(value) {
    let isInstance = true;
    isInstance = isInstance && "country" in value;
    isInstance = isInstance && "dateOfBirth" in value;
    isInstance = isInstance && "fullAddress" in value;
    isInstance = isInstance && "fullName" in value;
    return isInstance;
}
function GetKycRespFromJSON(json) {
    return GetKycRespFromJSONTyped(json, false);
}
function GetKycRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'city': !(0, runtime_1.exists)(json, 'city') ? undefined : json['city'],
        'country': json['country'],
        'dateOfBirth': json['date_of_birth'],
        'emailAddress': !(0, runtime_1.exists)(json, 'email_address') ? undefined : json['email_address'],
        'familyName': !(0, runtime_1.exists)(json, 'family_name') ? undefined : json['family_name'],
        'fullAddress': json['full_address'],
        'fullName': json['full_name'],
        'givenName': !(0, runtime_1.exists)(json, 'given_name') ? undefined : json['given_name'],
        'phoneNumber': !(0, runtime_1.exists)(json, 'phone_number') ? undefined : json['phone_number'],
        'postalCode': !(0, runtime_1.exists)(json, 'postal_code') ? undefined : json['postal_code'],
        'region': !(0, runtime_1.exists)(json, 'region') ? undefined : json['region'],
        'sex': !(0, runtime_1.exists)(json, 'sex') ? undefined : json['sex'],
        'street': !(0, runtime_1.exists)(json, 'street') ? undefined : json['street'],
    };
}
function GetKycRespToJSON(value) {
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
        'full_address': value.fullAddress,
        'full_name': value.fullName,
        'given_name': value.givenName,
        'phone_number': value.phoneNumber,
        'postal_code': value.postalCode,
        'region': value.region,
        'sex': value.sex,
        'street': value.street,
    };
}
//# sourceMappingURL=GetKycResp.js.map