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
    async idvKycGet(accessToken, body) {
        return this.api.v1IdvKycGetPost({
            authorization: `Bearer ${accessToken}`,
            getKycReq: {
                userId: body.user_id,
                country: body.country,
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
    async getKycUS(accessToken, body) {
        return this.api.v1IdvUsKycGetPost({
            authorization: `Bearer ${accessToken}`,
            plaidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async putKycUS(body) {
        return this.api.v1IdvUsKycPutPost({
            plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
        });
    }
    async idvCookieStartUS(body) {
        return this.api.v1IdvUsCookieStartPost({
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async healthUS() {
        return this.api.v1IdvUsHealthGet();
    }
    async idvStartUK(accessToken, body) {
        return this.api.v1IdvUkStartPost({
            authorization: `Bearer ${accessToken}`,
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async getKycUK(accessToken, body) {
        return this.api.v1IdvUkKycGetPost({
            authorization: `Bearer ${accessToken}`,
            plaidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async putKycUK(body) {
        return this.api.v1IdvUkKycPutPost({
            plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
        });
    }
    async idvCookieStartUK(body) {
        return this.api.v1IdvUkCookieStartPost({
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async healthUK() {
        return this.api.v1IdvUkHealthGet();
    }
    async idvStartCA(accessToken, body) {
        return this.api.v1IdvCaStartPost({
            authorization: `Bearer ${accessToken}`,
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async getKycCA(accessToken, body) {
        return this.api.v1IdvCaKycGetPost({
            authorization: `Bearer ${accessToken}`,
            plaidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async putKycCA(body) {
        return this.api.v1IdvCaKycPutPost({
            plaidPutKycReq: { userId: body.user_id, idvSessionId: body.idv_session_id },
        });
    }
    async idvCookieStartCA(body) {
        return this.api.v1IdvCaCookieStartPost({
            plaidStartIdvRequest: {
                userId: body.user_id,
                email: body.email,
                callbackUrl: body.callback_url,
            },
        });
    }
    async healthCA() {
        return this.api.v1IdvCaHealthGet();
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
    async getKycJP(accessToken, body) {
        return this.api.v1IdvJpKycGetPost({
            authorization: `Bearer ${accessToken}`,
            liquidGetKycReq: { userId: body.user_id, fields: body.fields },
        });
    }
    async putKycJP(body) {
        return this.api.v1IdvJpKycPutPost({
            liquidPutKycReq: { userId: body.user_id },
        });
    }
    async idvCookieStartJP(body) {
        return this.api.v1IdvJpCookieStartPost({
            liquidStartIdvRequest: {
                userId: body.user_id,
                callbackUrl: body.callback_url,
            },
        });
    }
    async notificationJP(body) {
        return this.api.v1IdvJpNotificationPost({
            body,
        });
    }
    async healthJP() {
        return this.api.v1IdvJpHealthGet();
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
    async idvKycGetCN(accessToken, body) {
        return this.api.v1IdvCnKycGetPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvGetResultReq: {
                userId: body.user_id,
            },
        });
    }
    async idvResultWebCN() {
        return this.api.v1IdvCnResultWebPost();
    }
    async healthCN() {
        return this.api.v1IdvCnHealthGet();
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
    async idvMockKycGetCN(accessToken, body) {
        return this.api.v1IdvCnMockKycGetPost({
            authorization: `Bearer ${accessToken}`,
            tomoIdvMockGetResultReq: {
                userId: body.user_id,
            },
        });
    }
    async plaidTokenSession(body) {
        return this.api.v1IdvPlaidTokenSessionPost({
            plaidSessionTokenRequest: {
                userId: body.user_id,
                idvSessionId: body.idv_session_id,
            },
        });
    }
    async liquidTokenSession(body) {
        return this.api.v1IdvLiquidTokenSessionPost({
            liquidSessionTokenRequest: {
                userId: body.user_id,
            },
        });
    }
    async loginTicket(body) {
        return this.api.v1IdvLoginTicketPost({
            loginTicketRequest: {
                loginTicket: body.login_ticket,
                bizToken: body.biz_token,
            },
        });
    }
}
exports.IdvServerClient = IdvServerClient;
//# sourceMappingURL=idv-client.js.map