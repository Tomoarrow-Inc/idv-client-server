"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidIdvField = void 0;
exports.instanceOfLiquidIdvField = instanceOfLiquidIdvField;
exports.LiquidIdvFieldFromJSON = LiquidIdvFieldFromJSON;
exports.LiquidIdvFieldFromJSONTyped = LiquidIdvFieldFromJSONTyped;
exports.LiquidIdvFieldToJSON = LiquidIdvFieldToJSON;
exports.LiquidIdvFieldToJSONTyped = LiquidIdvFieldToJSONTyped;
exports.LiquidIdvField = {
    Name: 'name',
    DateOfBirth: 'date_of_birth',
    Sex: 'sex',
    Address: 'address',
    PostalCode: 'postal_code'
};
function instanceOfLiquidIdvField(value) {
    for (const key in exports.LiquidIdvField) {
        if (Object.prototype.hasOwnProperty.call(exports.LiquidIdvField, key)) {
            if (exports.LiquidIdvField[key] === value) {
                return true;
            }
        }
    }
    return false;
}
function LiquidIdvFieldFromJSON(json) {
    return LiquidIdvFieldFromJSONTyped(json, false);
}
function LiquidIdvFieldFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function LiquidIdvFieldToJSON(value) {
    return value;
}
function LiquidIdvFieldToJSONTyped(value, ignoreDiscriminator) {
    return value;
}
//# sourceMappingURL=LiquidIdvField.js.map