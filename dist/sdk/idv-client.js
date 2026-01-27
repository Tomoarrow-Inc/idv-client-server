"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdvServerClient = void 0;
const DefaultApi_1 = require("./generated/idv-client-server/apis/DefaultApi");
const runtime_1 = require("./generated/idv-client-server/runtime");
const Country_1 = require("./generated/idv-client-server/models/Country");
const case_converter_1 = require("./case-converter");
function resolveBaseUrl() {
    const raw = process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
    return raw.replace(/\/+$/, '');
}
function createConfiguration() {
    return new runtime_1.Configuration({ basePath: resolveBaseUrl() });
}
function countryFromString(s) {
    const u = s?.toUpperCase();
    return u === 'US' ? Country_1.Country.Us : u === 'UK' ? Country_1.Country.Uk : u === 'CA' ? Country_1.Country.Ca : u === 'JP' ? Country_1.Country.Jp : Country_1.Country.Unknown;
}
class IdvServerClient {
    api;
    constructor(config) {
        this.api = new DefaultApi_1.DefaultApi(config ?? createConfiguration());
    }
    async issueToken(params) {
        const result = await this.api.v1Oauth2TokenPost({
            clientAssertion: params.clientAssertion,
            clientAssertionType: params.clientAssertionType,
            grantType: params.grantType,
            resource: params.resource,
            scope: params.scope,
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
    async getKycUS(accessToken, body) {
        const result = await this.api.v1IdvUsKycGetPost({
            authorization: `Bearer ${accessToken}`,
            plaidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
    async getKycJP(accessToken, body) {
        const result = await this.api.v1IdvJpKycGetPost({
            authorization: `Bearer ${accessToken}`,
            liquidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
    async idvStartJP(accessToken, body) {
        const result = await this.api.v1IdvJpStartPost({
            authorization: `Bearer ${accessToken}`,
            liquidStartIdvRequest: {
                userId: body.user_id,
                callbackUrl: body.callback_url ?? 'idvexpo://verify',
            },
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
    async idvStartUS(accessToken, body) {
        const result = await this.api.v1IdvUsStartPost({
            authorization: `Bearer ${accessToken}`,
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email ?? 'chanhee@tomoarrow.com',
                callbackUrl: body.callback_url ?? 'idvexpo://verify',
            },
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
    async idvStart(accessToken, body) {
        const result = await this.api.v1IdvStartPost({
            authorization: `Bearer ${accessToken}`,
            startIdvReq: {
                userId: body.user_id,
                callbackUrl: body.callback_url,
                email: body.email,
                country: countryFromString(body.country),
            },
        });
        return (0, case_converter_1.toSnakeCaseKeys)(result);
    }
}
exports.IdvServerClient = IdvServerClient;
//# sourceMappingURL=idv-client.js.map