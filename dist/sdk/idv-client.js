"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdvServerClient = void 0;
const DefaultApi_1 = require("./generated/apis/DefaultApi");
const runtime_1 = require("./generated/runtime");
const Country_1 = require("./generated/models/Country");
function resolveBaseUrl() {
    const raw = process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
    return raw.replace(/\/+$/, '');
}
function createConfiguration() {
    return new runtime_1.Configuration({ basePath: resolveBaseUrl() });
}
class IdvServerClient {
    api;
    constructor(config) {
        this.api = new DefaultApi_1.DefaultApi(config ?? createConfiguration());
    }
    async issueToken(params) {
        return this.api.v1Oauth2TokenPost({
            clientAssertion: params.clientAssertion,
            clientAssertionType: params.clientAssertionType,
            grantType: params.grantType,
            resource: params.resource,
            scope: params.scope,
        });
    }
    async getKycUS(accessToken, userId) {
        return this.api.v1IdvUsKycGetPost({
            authorization: `Bearer ${accessToken}`,
            getKycReq: { userId, country: Country_1.Country.Us },
        });
    }
    async getKycJP(accessToken, userId) {
        return this.api.v1IdvJpKycGetPost({
            authorization: `Bearer ${accessToken}`,
            getKycReq: { userId, country: Country_1.Country.Jp },
        });
    }
    async idvStartJP(accessToken, userId, callbackUrl = 'idvexpo://verify') {
        return this.api.v1IdvJpStartPost({
            authorization: `Bearer ${accessToken}`,
            liquidStartIdvRequest: { userId, callbackUrl },
        });
    }
    async idvStartUS(accessToken, userId, email = 'chanhee@tomoarrow.com', callbackUrl = 'idvexpo://verify') {
        return this.api.v1IdvUsStartPost({
            authorization: `Bearer ${accessToken}`,
            plaidStartIdvRequest: { userId, email, callbackUrl },
        });
    }
    async idvStart(accessToken, userId, callbackUrl, email, country) {
        const sirqCountry = country === 'US'
            ? Country_1.Country.Us
            : country === 'UK'
                ? Country_1.Country.Uk
                : country === 'CA'
                    ? Country_1.Country.Ca
                    : country === 'JP'
                        ? Country_1.Country.Jp
                        : Country_1.Country.Unknown;
        return this.api.v1IdvStartPost({
            authorization: `Bearer ${accessToken}`,
            startIdvReq: {
                sirqUserId: userId,
                sirqCallbackUrl: callbackUrl,
                sirqEmail: email,
                sirqCountry,
            },
        });
    }
}
exports.IdvServerClient = IdvServerClient;
//# sourceMappingURL=idv-client.js.map