"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdvServerClient = void 0;
const DefaultApi_1 = require("./generated/apis/DefaultApi");
const runtime_1 = require("./generated/runtime");
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
    async getKycUS(accessToken, body) {
        return this.api.v1IdvUsKycGetPost({
            authorization: `Bearer ${accessToken}`,
            plaidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async getKycJP(accessToken, body) {
        return this.api.v1IdvJpKycGetPost({
            authorization: `Bearer ${accessToken}`,
            liquidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async idvStartJP(accessToken, body) {
        return this.api.v1IdvJpStartPost({
            authorization: `Bearer ${accessToken}`,
            liquidStartIdvRequest: {
                userId: body.user_id,
                callbackUrl: body.callback_url,
            },
        });
    }
    async idvStartUS(accessToken, body) {
        return this.api.v1IdvUsStartPost({
            authorization: `Bearer ${accessToken}`,
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async idvStart(accessToken, body) {
        return this.api.v1IdvStartPost({
            authorization: `Bearer ${accessToken}`,
            startIdvReq: {
                userId: body.user_id,
                callbackUrl: body.callback_url,
                email: body.email,
                country: body.country,
            },
        });
    }
    async idvStartCN(accessToken, body) {
        return this.api.v1IdvCnStartPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvStartReq: {
                userId: body.user_id,
                redirectUrl: body.redirect_url,
            },
        });
    }
    async idvTokenCN(accessToken, body) {
        return this.api.v1IdvCnTokenPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvIssueTokenReq: {
                userId: body.user_id,
            },
        });
    }
    async idvResultCN(accessToken, body) {
        return this.api.v1IdvCnResultPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvGetResultReq: {
                userId: body.user_id,
            },
        });
    }
    async idvMockStartCN(accessToken, body) {
        return this.api.v1IdvCnMockStartPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvMockStartReq: {
                userId: body.user_id,
                redirectUrl: body.redirect_url,
            },
        });
    }
    async idvMockTokenCN(accessToken, body) {
        return this.api.v1IdvCnMockTokenPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvMockIssueTokenReq: {
                userId: body.user_id,
            },
        });
    }
    async idvMockResultCN(accessToken, body) {
        return this.api.v1IdvCnMockResultPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvMockGetResultReq: {
                userId: body.user_id,
            },
        });
    }
}
exports.IdvServerClient = IdvServerClient;
//# sourceMappingURL=idv-client.js.map