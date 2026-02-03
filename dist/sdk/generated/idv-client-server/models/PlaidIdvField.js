"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaidIdvField = void 0;
exports.instanceOfPlaidIdvField = instanceOfPlaidIdvField;
exports.PlaidIdvFieldFromJSON = PlaidIdvFieldFromJSON;
exports.PlaidIdvFieldFromJSONTyped = PlaidIdvFieldFromJSONTyped;
exports.PlaidIdvFieldToJSON = PlaidIdvFieldToJSON;
exports.PlaidIdvFieldToJSONTyped = PlaidIdvFieldToJSONTyped;
exports.PlaidIdvField = {
    DateOfBirth: 'date_of_birth',
    EmailAddress: 'email_address',
    PhoneNumber: 'phone_number',
    FamilyName: 'family_name',
    GivenName: 'given_name',
    City: 'city',
    Country: 'country',
    PostalCode: 'postal_code',
    Region: 'region',
    Street: 'street'
};
function instanceOfPlaidIdvField(value) {
    for (const key in exports.PlaidIdvField) {
        if (Object.prototype.hasOwnProperty.call(exports.PlaidIdvField, key)) {
            if (exports.PlaidIdvField[key] === value) {
                return true;
            }
        }
    }
    return false;
}
function PlaidIdvFieldFromJSON(json) {
    return PlaidIdvFieldFromJSONTyped(json, false);
}
function PlaidIdvFieldFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function PlaidIdvFieldToJSON(value) {
    return value;
}
function PlaidIdvFieldToJSONTyped(value, ignoreDiscriminator) {
    return value;
}
//# sourceMappingURL=PlaidIdvField.js.map