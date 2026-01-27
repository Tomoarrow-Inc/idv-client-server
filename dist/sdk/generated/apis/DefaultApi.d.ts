import * as runtime from '../runtime';
import type { GetKycReq, GetKycResp, GetKycUnionResp, LiquidGetKycReq, LiquidIntegratedAppResponse, LiquidStartIdvRequest, PlaidGetKycReq, PlaidStartIdvRequest, PlaidStartIdvResp, StartIdvReq, StartIdvResp, TokenResponse, TomoIdvGetResultReq, TomoIdvIssueTokenReq, TomoIdvIssueTokenRes, TomoIdvStartReq, TomoIdvStartRes } from '../models/index';
export interface V1IdvCaKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvCaStartPostRequest {
    authorization?: string;
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvCnResultPostRequest {
    authorization?: string;
    tomoIdvGetResultReq?: TomoIdvGetResultReq;
}
export interface V1IdvCnStartPostRequest {
    authorization?: string;
    tomoIdvStartReq?: TomoIdvStartReq;
}
export interface V1IdvCnTokenPostRequest {
    authorization?: string;
    tomoIdvIssueTokenReq?: TomoIdvIssueTokenReq;
}
export interface V1IdvJpKycGetPostRequest {
    authorization?: string;
    liquidGetKycReq?: LiquidGetKycReq;
}
export interface V1IdvJpStartPostRequest {
    authorization?: string;
    liquidStartIdvRequest?: LiquidStartIdvRequest;
}
export interface V1IdvKycGetPostRequest {
    authorization?: string;
    getKycReq?: GetKycReq;
}
export interface V1IdvStartPostRequest {
    authorization?: string;
    startIdvReq?: StartIdvReq;
}
export interface V1IdvUkKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvUkStartPostRequest {
    authorization?: string;
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvUsKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvUsStartPostRequest {
    authorization?: string;
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1Oauth2TokenPostRequest {
    clientAssertion: string;
    clientAssertionType: string;
    grantType: string;
    resource?: string;
    scope?: string;
}
export declare class DefaultApi extends runtime.BaseAPI {
    v1IdvCaHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvCaHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvCaKycGetPostRaw(requestParameters: V1IdvCaKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvCaKycGetPost(requestParameters?: V1IdvCaKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvCaStartPostRaw(requestParameters: V1IdvCaStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvCaStartPost(requestParameters?: V1IdvCaStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvCnHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvCnHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvCnResultPostRaw(requestParameters: V1IdvCnResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>>;
    v1IdvCnResultPost(requestParameters?: V1IdvCnResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any>;
    v1IdvCnStartPostRaw(requestParameters: V1IdvCnStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvStartRes>>;
    v1IdvCnStartPost(requestParameters?: V1IdvCnStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvStartRes>;
    v1IdvCnTokenPostRaw(requestParameters: V1IdvCnTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvIssueTokenRes>>;
    v1IdvCnTokenPost(requestParameters?: V1IdvCnTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvIssueTokenRes>;
    v1IdvJpHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvJpHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvJpKycGetPostRaw(requestParameters: V1IdvJpKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvJpKycGetPost(requestParameters?: V1IdvJpKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvJpStartPostRaw(requestParameters: V1IdvJpStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LiquidIntegratedAppResponse>>;
    v1IdvJpStartPost(requestParameters?: V1IdvJpStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LiquidIntegratedAppResponse>;
    v1IdvKycGetPostRaw(requestParameters: V1IdvKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycResp>>;
    v1IdvKycGetPost(requestParameters?: V1IdvKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycResp>;
    v1IdvStartPostRaw(requestParameters: V1IdvStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StartIdvResp>>;
    v1IdvStartPost(requestParameters?: V1IdvStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StartIdvResp>;
    v1IdvUkHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvUkHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvUkKycGetPostRaw(requestParameters: V1IdvUkKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvUkKycGetPost(requestParameters?: V1IdvUkKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvUkStartPostRaw(requestParameters: V1IdvUkStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUkStartPost(requestParameters?: V1IdvUkStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvUsHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvUsHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvUsKycGetPostRaw(requestParameters: V1IdvUsKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvUsKycGetPost(requestParameters?: V1IdvUsKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvUsStartPostRaw(requestParameters: V1IdvUsStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUsStartPost(requestParameters?: V1IdvUsStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1Oauth2TokenPostRaw(requestParameters: V1Oauth2TokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TokenResponse>>;
    v1Oauth2TokenPost(requestParameters: V1Oauth2TokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TokenResponse>;
}
