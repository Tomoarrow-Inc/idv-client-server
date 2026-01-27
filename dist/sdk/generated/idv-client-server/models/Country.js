"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
exports.CountryFromJSON = CountryFromJSON;
exports.CountryFromJSONTyped = CountryFromJSONTyped;
exports.CountryToJSON = CountryToJSON;
exports.Country = {
    Us: 'us',
    Uk: 'uk',
    Ca: 'ca',
    Jp: 'jp',
    Unknown: 'unknown'
};
function CountryFromJSON(json) {
    return CountryFromJSONTyped(json, false);
}
function CountryFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function CountryToJSON(value) {
    return value;
}
//# sourceMappingURL=Country.js.map