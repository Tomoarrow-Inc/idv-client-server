"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCaseKeys = toSnakeCaseKeys;
exports.toCamelCaseKeys = toCamelCaseKeys;
function isPlainObject(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
}
function camelToSnake(str) {
    return str.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
}
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function toSnakeCaseKeys(value) {
    if (value === null || value === undefined)
        return value;
    if (typeof value !== 'object')
        return value;
    if (value instanceof Date)
        return value;
    if (Array.isArray(value))
        return value.map((item) => toSnakeCaseKeys(item));
    if (!isPlainObject(value))
        return value;
    const out = {};
    for (const key of Object.keys(value)) {
        const newKey = camelToSnake(key);
        out[newKey] = toSnakeCaseKeys(value[key]);
    }
    return out;
}
function toCamelCaseKeys(value) {
    if (value === null || value === undefined)
        return value;
    if (typeof value !== 'object')
        return value;
    if (value instanceof Date)
        return value;
    if (Array.isArray(value))
        return value.map((item) => toCamelCaseKeys(item));
    if (!isPlainObject(value))
        return value;
    const out = {};
    for (const key of Object.keys(value)) {
        const newKey = snakeToCamel(key);
        out[newKey] = toCamelCaseKeys(value[key]);
    }
    return out;
}
//# sourceMappingURL=case-converter.js.map