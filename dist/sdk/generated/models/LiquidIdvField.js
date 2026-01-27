"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidIdvField = void 0;
exports.LiquidIdvFieldFromJSON = LiquidIdvFieldFromJSON;
exports.LiquidIdvFieldFromJSONTyped = LiquidIdvFieldFromJSONTyped;
exports.LiquidIdvFieldToJSON = LiquidIdvFieldToJSON;
exports.LiquidIdvField = {
    Name: 'name',
    DateOfBirth: 'date_of_birth',
    Sex: 'sex',
    Address: 'address',
    PostalCode: 'postal_code'
};
function LiquidIdvFieldFromJSON(json) {
    return LiquidIdvFieldFromJSONTyped(json, false);
}
function LiquidIdvFieldFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function LiquidIdvFieldToJSON(value) {
    return value;
}
//# sourceMappingURL=LiquidIdvField.js.map