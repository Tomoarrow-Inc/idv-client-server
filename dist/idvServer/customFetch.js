"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customFetch = void 0;
function normalizeBaseUrl(raw) {
    return raw.replace(/\/+$/g, "");
}
function resolveUrl(url) {
    const rawBase = process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL;
    if (!rawBase) {
        throw new Error("idv-client-server: set IDV_BASE_URL for generated client");
    }
    const base = normalizeBaseUrl(rawBase);
    if (/^https?:\/\//i.test(url))
        return url;
    return new URL(url, base).toString();
}
async function readBodySafe(res) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        return await res.json().catch(() => undefined);
    }
    return await res.text().catch(() => undefined);
}
const customFetch = async (url, options) => {
    const requestUrl = resolveUrl(url);
    const res = await fetch(requestUrl, options);
    if (!res.ok) {
        const err = {
            status: res.status,
            statusText: res.statusText,
            url: requestUrl,
            body: await readBodySafe(res)
        };
        throw Object.assign(new Error(`HTTP ${err.status} ${err.statusText}`), err);
    }
    const data = await readBodySafe(res);
    return { status: res.status, data, headers: res.headers };
};
exports.customFetch = customFetch;
//# sourceMappingURL=customFetch.js.map