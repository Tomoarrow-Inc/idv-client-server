"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaidIdvField = void 0;
exports.PlaidIdvFieldFromJSON = PlaidIdvFieldFromJSON;
exports.PlaidIdvFieldFromJSONTyped = PlaidIdvFieldFromJSONTyped;
exports.PlaidIdvFieldToJSON = PlaidIdvFieldToJSON;
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
function PlaidIdvFieldFromJSON(json) {
    return PlaidIdvFieldFromJSONTyped(json, false);
}
function PlaidIdvFieldFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function PlaidIdvFieldToJSON(value) {
    return value;
}
//# sourceMappingURL=PlaidIdvField.js.map