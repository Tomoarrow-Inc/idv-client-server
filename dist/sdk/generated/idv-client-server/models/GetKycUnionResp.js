"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespFromJSON = GetKycUnionRespFromJSON;
exports.GetKycUnionRespFromJSONTyped = GetKycUnionRespFromJSONTyped;
exports.GetKycUnionRespToJSON = GetKycUnionRespToJSON;
const GetKycUnionRespMap_1 = require("./GetKycUnionRespMap");
const GetKycUnionRespStandard_1 = require("./GetKycUnionRespStandard");
function GetKycUnionRespFromJSON(json) {
    return GetKycUnionRespFromJSONTyped(json, false);
}
function GetKycUnionRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return { ...(0, GetKycUnionRespMap_1.GetKycUnionRespMapFromJSONTyped)(json, true), ...(0, GetKycUnionRespStandard_1.GetKycUnionRespStandardFromJSONTyped)(json, true) };
}
function GetKycUnionRespToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    if ((0, GetKycUnionRespMap_1.instanceOfGetKycUnionRespMap)(value)) {
        return (0, GetKycUnionRespMap_1.GetKycUnionRespMapToJSON)(value);
    }
    if ((0, GetKycUnionRespStandard_1.instanceOfGetKycUnionRespStandard)(value)) {
        return (0, GetKycUnionRespStandard_1.GetKycUnionRespStandardToJSON)(value);
    }
    return {};
}
//# sourceMappingURL=GetKycUnionResp.js.map