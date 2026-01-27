"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespMapTagEnum = void 0;
exports.instanceOfGetKycUnionRespMap = instanceOfGetKycUnionRespMap;
exports.GetKycUnionRespMapFromJSON = GetKycUnionRespMapFromJSON;
exports.GetKycUnionRespMapFromJSONTyped = GetKycUnionRespMapFromJSONTyped;
exports.GetKycUnionRespMapToJSON = GetKycUnionRespMapToJSON;
exports.GetKycUnionRespMapTagEnum = {
    GetKycUnionRespMap: 'GetKycUnionRespMap'
};
function instanceOfGetKycUnionRespMap(value) {
    let isInstance = true;
    isInstance = isInstance && "contents" in value;
    isInstance = isInstance && "tag" in value;
    return isInstance;
}
function GetKycUnionRespMapFromJSON(json) {
    return GetKycUnionRespMapFromJSONTyped(json, false);
}
function GetKycUnionRespMapFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'contents': json['contents'],
        'tag': json['tag'],
    };
}
function GetKycUnionRespMapToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'contents': value.contents,
        'tag': value.tag,
    };
}
//# sourceMappingURL=GetKycUnionRespMap.js.map