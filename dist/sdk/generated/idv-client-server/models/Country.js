"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
exports.instanceOfCountry = instanceOfCountry;
exports.CountryFromJSON = CountryFromJSON;
exports.CountryFromJSONTyped = CountryFromJSONTyped;
exports.CountryToJSON = CountryToJSON;
exports.CountryToJSONTyped = CountryToJSONTyped;
exports.Country = {
    Us: 'us',
    Uk: 'uk',
    Ca: 'ca',
    Jp: 'jp',
    Unknown: 'unknown'
};
function instanceOfCountry(value) {
    for (const key in exports.Country) {
        if (Object.prototype.hasOwnProperty.call(exports.Country, key)) {
            if (exports.Country[key] === value) {
                return true;
            }
        }
    }
    return false;
}
function CountryFromJSON(json) {
    return CountryFromJSONTyped(json, false);
}
function CountryFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function CountryToJSON(value) {
    return value;
}
function CountryToJSONTyped(value, ignoreDiscriminator) {
    return value;
}
//# sourceMappingURL=Country.js.map