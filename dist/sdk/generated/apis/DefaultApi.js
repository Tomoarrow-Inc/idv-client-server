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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/ca/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters.plaidGetKycReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvCaKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCaKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvCaStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/ca/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters.plaidStartIdvRequest),
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
    async v1IdvCnResultPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/cn/result`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvGetResultReqToJSON)(requestParameters.tomoIdvGetResultReq),
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
    async v1IdvCnStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/cn/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvStartReqToJSON)(requestParameters.tomoIdvStartReq),
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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/cn/token`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.TomoIdvIssueTokenReqToJSON)(requestParameters.tomoIdvIssueTokenReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.TomoIdvIssueTokenResFromJSON)(jsonValue));
    }
    async v1IdvCnTokenPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvCnTokenPostRaw(requestParameters, initOverrides);
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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/jp/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidGetKycReqToJSON)(requestParameters.liquidGetKycReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvJpKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvJpKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvJpStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/jp/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.LiquidStartIdvRequestToJSON)(requestParameters.liquidStartIdvRequest),
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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.GetKycReqToJSON)(requestParameters.getKycReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycRespFromJSON)(jsonValue));
    }
    async v1IdvKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.StartIdvReqToJSON)(requestParameters.startIdvReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.StartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvStartPostRaw(requestParameters, initOverrides);
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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/uk/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters.plaidGetKycReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvUkKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUkKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUkStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/uk/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters.plaidStartIdvRequest),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUkStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUkStartPostRaw(requestParameters, initOverrides);
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
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/us/kyc/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidGetKycReqToJSON)(requestParameters.plaidGetKycReq),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.GetKycUnionRespFromJSON)(jsonValue));
    }
    async v1IdvUsKycGetPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUsKycGetPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1IdvUsStartPostRaw(requestParameters, initOverrides) {
        const queryParameters = {};
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json;charset=utf-8';
        if (requestParameters.authorization !== undefined && requestParameters.authorization !== null) {
            headerParameters['Authorization'] = String(requestParameters.authorization);
        }
        const response = await this.request({
            path: `/v1/idv/us/start`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: (0, index_1.PlaidStartIdvRequestToJSON)(requestParameters.plaidStartIdvRequest),
        }, initOverrides);
        return new runtime.JSONApiResponse(response, (jsonValue) => (0, index_1.PlaidStartIdvRespFromJSON)(jsonValue));
    }
    async v1IdvUsStartPost(requestParameters = {}, initOverrides) {
        const response = await this.v1IdvUsStartPostRaw(requestParameters, initOverrides);
        return await response.value();
    }
    async v1Oauth2TokenPostRaw(requestParameters, initOverrides) {
        if (requestParameters.clientAssertion === null || requestParameters.clientAssertion === undefined) {
            throw new runtime.RequiredError('clientAssertion', 'Required parameter requestParameters.clientAssertion was null or undefined when calling v1Oauth2TokenPost.');
        }
        if (requestParameters.clientAssertionType === null || requestParameters.clientAssertionType === undefined) {
            throw new runtime.RequiredError('clientAssertionType', 'Required parameter requestParameters.clientAssertionType was null or undefined when calling v1Oauth2TokenPost.');
        }
        if (requestParameters.grantType === null || requestParameters.grantType === undefined) {
            throw new runtime.RequiredError('grantType', 'Required parameter requestParameters.grantType was null or undefined when calling v1Oauth2TokenPost.');
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
        if (requestParameters.clientAssertion !== undefined) {
            formParams.append('client_assertion', requestParameters.clientAssertion);
        }
        if (requestParameters.clientAssertionType !== undefined) {
            formParams.append('client_assertion_type', requestParameters.clientAssertionType);
        }
        if (requestParameters.grantType !== undefined) {
            formParams.append('grant_type', requestParameters.grantType);
        }
        if (requestParameters.resource !== undefined) {
            formParams.append('resource', requestParameters.resource);
        }
        if (requestParameters.scope !== undefined) {
            formParams.append('scope', requestParameters.scope);
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