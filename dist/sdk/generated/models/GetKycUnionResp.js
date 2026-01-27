"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycUnionRespFromJSON = GetKycUnionRespFromJSON;
exports.GetKycUnionRespFromJSONTyped = GetKycUnionRespFromJSONTyped;
exports.GetKycUnionRespToJSON = GetKycUnionRespToJSON;
const LiquidGetKycResp_1 = require("./LiquidGetKycResp");
from;
'./{ [key: string]: string; }';
const module_1 = require();
FromJSON,
    { [key]: string, string };
FromJSONTyped,
    { [key]: string, string };
ToJSON,
;
from;
'./{ [key: string]: string; }';
function GetKycUnionRespFromJSON(json) {
    return GetKycUnionRespFromJSONTyped(json, false);
}
function GetKycUnionRespFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return { ...(0, LiquidGetKycResp_1.LiquidGetKycRespFromJSONTyped)(json, true), ...{ [key]: string, string } };
}
function GetKycUnionRespToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    if ((0, LiquidGetKycResp_1.instanceOfLiquidGetKycResp)(value)) {
        return (0, LiquidGetKycResp_1.LiquidGetKycRespToJSON)(value);
    }
    if (module_1.instanceOf) {
        [key, string];
        string;
    }
    (value);
    {
        return { [key]: string, string };
        ToJSON(value);
    }
    return {};
}
//# sourceMappingURL=GetKycUnionResp.js.map