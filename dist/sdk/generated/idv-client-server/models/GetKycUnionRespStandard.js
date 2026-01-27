"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespStandardTagEnum = void 0;
exports.instanceOfGetKycUnionRespStandard = instanceOfGetKycUnionRespStandard;
exports.GetKycUnionRespStandardFromJSON = GetKycUnionRespStandardFromJSON;
exports.GetKycUnionRespStandardFromJSONTyped = GetKycUnionRespStandardFromJSONTyped;
exports.GetKycUnionRespStandardToJSON = GetKycUnionRespStandardToJSON;
const LiquidGetKycResp_1 = require("./LiquidGetKycResp");
exports.GetKycUnionRespStandardTagEnum = {
    GetKycUnionRespStandard: 'GetKycUnionRespStandard'
};
function instanceOfGetKycUnionRespStandard(value) {
    let isInstance = true;
    isInstance = isInstance && "contents" in value;
    isInstance = isInstance && "tag" in value;
    return isInstance;
}
function GetKycUnionRespStandardFromJSON(json) {
    return GetKycUnionRespStandardFromJSONTyped(json, false);
}
function GetKycUnionRespStandardFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'contents': (0, LiquidGetKycResp_1.LiquidGetKycRespFromJSON)(json['contents']),
        'tag': json['tag'],
    };
}
function GetKycUnionRespStandardToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'contents': (0, LiquidGetKycResp_1.LiquidGetKycRespToJSON)(value.contents),
        'tag': value.tag,
    };
}
//# sourceMappingURL=GetKycUnionRespStandard.js.map