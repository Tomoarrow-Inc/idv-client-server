/**
 * Case converter for SDK boundary: customer application ↔ SDK uses snake_case;
 * SDK ↔ idv-server (generated client) uses camelCase.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Recursively convert plain object keys from camelCase to snake_case.
 * Arrays are mapped element-wise; primitives, null, undefined, and non-plain objects (e.g. Date) are returned as-is.
 */
export function toSnakeCaseKeys<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map((item) => toSnakeCaseKeys(item)) as T;
  if (!isPlainObject(value)) return value;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    const newKey = camelToSnake(key);
    out[newKey] = toSnakeCaseKeys((value as Record<string, unknown>)[key]);
  }
  return out as T;
}

/**
 * Recursively convert plain object keys from snake_case to camelCase.
 * Arrays are mapped element-wise; primitives, null, undefined, and non-plain objects are returned as-is.
 */
export function toCamelCaseKeys<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map((item) => toCamelCaseKeys(item)) as T;
  if (!isPlainObject(value)) return value;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    const newKey = snakeToCamel(key);
    out[newKey] = toCamelCaseKeys((value as Record<string, unknown>)[key]);
  }
  return out as T;
}
