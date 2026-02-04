"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultApi = void 0;
const runtime = __importStar(require("../runtime"));
const index_1 = require("../models/index");
class DefaultApi extends runtime.BaseAPI {
    async v1IdvCaCookieStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/ca/cookie/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvCaCookieStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCaCookieStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCaHealthGetRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/ca/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvCaHealthGet(initOverrides) {
        const response = await this.v1IdvCaHealthGetRaw(initOverrides);
        return await response.value();
    }
    async v1IdvCaKycGetPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/ca/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters['plaidGetKycReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvCaKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCaKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCaKycPutPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/ca/kyc/put`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidPutKycReqToJSON)(requestParameters['plaidPutKycReq']),
        }, initOverrides);
        return new runtime.VoidApiResponse(response);
    }
    async v1IdvCaKycPutPost(requestParameters = {}, initOverrides) {
        await this.v1IdvCaKycPutPostRaw(requestParameters, initOverrides);
    }
    async v1IdvCaStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/ca/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvCaStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCaStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnHealthGetRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/cn/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvCnHealthGet(initOverrides) {
        const response = await this.v1IdvCnHealthGetRaw(initOverrides);
        return await response.value();
    }
    async v1IdvCnMockResultPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/mock/result`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvMockGetResultReqToJSON)(requestParameters['tomoIdvMockGetResultReq']),
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvCnMockResultPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnMockResultPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnMockStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/mock/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvMockStartReqToJSON)(requestParameters['tomoIdvMockStartReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TomoIdvMockStartResFromJSON)(jsonValue));
    }
    async v1IdvCnMockStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnMockStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnMockTokenPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/mock/token`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvMockIssueTokenReqToJSON)(requestParameters['tomoIdvMockIssueTokenReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TomoIdvMockIssueTokenResFromJSON)(jsonValue));
    }
    async v1IdvCnMockTokenPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnMockTokenPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnResultPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/result`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvGetResultReqToJSON)(requestParameters['tomoIdvGetResultReq']),
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvCnResultPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnResultPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnResultWebPostRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/cn/result/web`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvCnResultWebPost(initOverrides) {
        const response = await this.v1IdvCnResultWebPostRaw(initOverrides);
        return await response.value();
    }
    async v1IdvCnStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvStartReqToJSON)(requestParameters['tomoIdvStartReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TomoIdvStartResFromJSON)(jsonValue));
    }
    async v1IdvCnStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCnTokenPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/cn/token`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvIssueTokenReqToJSON)(requestParameters['tomoIdvIssueTokenReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TomoIdvIssueTokenResFromJSON)(jsonValue));
    }
    async v1IdvCnTokenPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnTokenPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvJpCookieStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/jp/cookie/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidStartIdvRequestToJSON)(requestParameters['liquidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.LiquidIntegratedAppResponseFromJSON)(jsonValue));
    }
    async v1IdvJpCookieStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvJpCookieStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvJpHealthGetRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/jp/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvJpHealthGet(initOverrides) {
        const response = await this.v1IdvJpHealthGetRaw(initOverrides);
        return await response.value();
    }
    async v1IdvJpKycGetPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/jp/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidGetKycReqToJSON)(requestParameters['liquidGetKycReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvJpKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvJpKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvJpKycPutPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/jp/kyc/put`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidPutKycReqToJSON)(requestParameters['liquidPutKycReq']),
        }, initOverrides);
        return new runtime.VoidApiResponse(response);
    }
    async v1IdvJpKycPutPost(requestParameters = {}, initOverrides) {
        await this.v1IdvJpKycPutPostRaw(requestParameters, initOverrides);
    }
    async v1IdvJpNotificationPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/jp/notification`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'],
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.EitherStringValueFromJSON)(jsonValue));
    }
    async v1IdvJpNotificationPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvJpNotificationPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvJpStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/jp/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidStartIdvRequestToJSON)(requestParameters['liquidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.LiquidIntegratedAppResponseFromJSON)(jsonValue));
    }
    async v1IdvJpStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvJpStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvKycGetPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.GetKycReqToJSON)(requestParameters['getKycReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycRespFromJSON)(jsonValue));
    }
    async v1IdvKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvLiquidTokenSessionPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/liquid/token/session`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidSessionTokenRequestToJSON)(requestParameters['liquidSessionTokenRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.SessionTokenFromJSON)(jsonValue));
    }
    async v1IdvLiquidTokenSessionPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvLiquidTokenSessionPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvLoginTicketPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/login-ticket`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LoginTicketRequestToJSON)(requestParameters['loginTicketRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.LoginTicketResponseFromJSON)(jsonValue));
    }
    async v1IdvLoginTicketPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvLoginTicketPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvPlaidTokenSessionPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/plaid/token/session`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidSessionTokenRequestToJSON)(requestParameters['plaidSessionTokenRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.SessionTokenFromJSON)(jsonValue));
    }
    async v1IdvPlaidTokenSessionPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvPlaidTokenSessionPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.StartIdvReqToJSON)(requestParameters['startIdvReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.StartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUkCookieStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/uk/cookie/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUkCookieStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUkCookieStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUkHealthGetRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/uk/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvUkHealthGet(initOverrides) {
        const response = await this.v1IdvUkHealthGetRaw(initOverrides);
        return await response.value();
    }
    async v1IdvUkKycGetPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/uk/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters['plaidGetKycReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvUkKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUkKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUkKycPutPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/uk/kyc/put`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidPutKycReqToJSON)(requestParameters['plaidPutKycReq']),
        }, initOverrides);
        return new runtime.VoidApiResponse(response);
    }
    async v1IdvUkKycPutPost(requestParameters = {}, initOverrides) {
        await this.v1IdvUkKycPutPostRaw(requestParameters, initOverrides);
    }
    async v1IdvUkStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/uk/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUkStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUkStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUsCookieStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/us/cookie/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUsCookieStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUsCookieStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUsHealthGetRaw(initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        const response = await this.request({
            path: `/v1/idv/us/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse(response);
        }
        else {
            return new runtime.TextApiResponse(response);
        }
    }
    async v1IdvUsHealthGet(initOverrides) {
        const response = await this.v1IdvUsHealthGetRaw(initOverrides);
        return await response.value();
    }
    async v1IdvUsKycGetPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/us/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters['plaidGetKycReq']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvUsKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUsKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUsKycPutPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        const response = await this.request({
            path: `/v1/idv/us/kyc/put`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidPutKycReqToJSON)(requestParameters['plaidPutKycReq']),
        }, initOverrides);
        return new runtime.VoidApiResponse(response);
    }
    async v1IdvUsKycPutPost(requestParameters = {}, initOverrides) {
        await this.v1IdvUsKycPutPostRaw(requestParameters, initOverrides);
    }
    async v1IdvUsStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters['authorization'] != null) {
            headerParameters['Authorization'] = String(requestParameters['authorization']);
        }
        const response = await this.request({
            path: `/v1/idv/us/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters['plaidStartIdvRequest']),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUsStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUsStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1Oauth2TokenPostRaw(requestParameters, initOverrides) {
        if (requestParameters['clientAssertion'] == null) {
            throw new runtime.RequiredError('clientAssertion', 'Required parameter "clientAssertion" was null or undefined when calling v1Oauth2TokenPost().');
        }
        if (requestParameters['clientAssertionType'] == null) {
            throw new runtime.RequiredError('clientAssertionType', 'Required parameter "clientAssertionType" was null or undefined when calling v1Oauth2TokenPost().');
        }
        if (requestParameters['grantType'] == null) {
            throw new runtime.RequiredError('grantType', 'Required parameter "grantType" was null or undefined when calling v1Oauth2TokenPost().');
        }
        const queryParameters = {};
        const headerParameters = {};
        const consumes = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        const canConsumeForm = runtime.canConsumeForm(consumes);
        let formParams;
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        }
        else {
            formParams = new URLSearchParams();
        }
        if (requestParameters['clientAssertion'] != null) {
            formParams.append('client_assertion', requestParameters['clientAssertion']);
        }
        if (requestParameters['clientAssertionType'] != null) {
            formParams.append('client_assertion_type', requestParameters['clientAssertionType']);
        }
        if (requestParameters['grantType'] != null) {
            formParams.append('grant_type', requestParameters['grantType']);
        }
        if (requestParameters['resource'] != null) {
            formParams.append('resource', requestParameters['resource']);
        }
        if (requestParameters['scope'] != null) {
            formParams.append('scope', requestParameters['scope']);
        }
        const response = await this.request({
            path: `/v1/oauth2/token`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TokenResponseFromJSON)(jsonValue));
    }
    async v1Oauth2TokenPost(requestParameters, initOverrides) {
        const response = await this.v1Oauth2TokenPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
}
exports.DefaultApi = DefaultApi;
//# sourceMappingURL=DefaultApi.js.map