import * as runtime from '../runtime';
import type { EitherStringValue, GetKycReq, GetKycResp, GetKycUnionResp, LiquidGetKycReq, LiquidIntegratedAppResponse, LiquidPutKycReq, LiquidSessionTokenRequest, LiquidStartIdvRequest, LoginTicketRequest, LoginTicketResponse, PlaidGetKycReq, PlaidPutKycReq, PlaidSessionTokenRequest, PlaidStartIdvRequest, PlaidStartIdvResp, SessionToken, StartIdvReq, StartIdvResp, TokenResponse, TomoIdvGetResultReq, TomoIdvIssueTokenReq, TomoIdvIssueTokenRes, TomoIdvMockGetResultReq, TomoIdvMockIssueTokenReq, TomoIdvMockIssueTokenRes, TomoIdvMockStartReq, TomoIdvMockStartRes, TomoIdvStartReq, TomoIdvStartRes } from '../models/index';
export interface V1IdvCaCookieStartPostRequest {
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvCaKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvCaKycPutPostRequest {
    plaidPutKycReq?: PlaidPutKycReq;
}
export interface V1IdvCaStartPostRequest {
    authorization?: string;
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvCnMockResultPostRequest {
    authorization?: string;
    tomoIdvMockGetResultReq?: TomoIdvMockGetResultReq;
}
export interface V1IdvCnMockStartPostRequest {
    authorization?: string;
    tomoIdvMockStartReq?: TomoIdvMockStartReq;
}
export interface V1IdvCnMockTokenPostRequest {
    authorization?: string;
    tomoIdvMockIssueTokenReq?: TomoIdvMockIssueTokenReq;
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
export interface V1IdvJpCookieStartPostRequest {
    liquidStartIdvRequest?: LiquidStartIdvRequest;
}
export interface V1IdvJpKycGetPostRequest {
    authorization?: string;
    liquidGetKycReq?: LiquidGetKycReq;
}
export interface V1IdvJpKycPutPostRequest {
    liquidPutKycReq?: LiquidPutKycReq;
}
export interface V1IdvJpNotificationPostRequest {
    body?: any | null;
}
export interface V1IdvJpStartPostRequest {
    authorization?: string;
    liquidStartIdvRequest?: LiquidStartIdvRequest;
}
export interface V1IdvKycGetPostRequest {
    authorization?: string;
    getKycReq?: GetKycReq;
}
export interface V1IdvLiquidTokenSessionPostRequest {
    liquidSessionTokenRequest?: LiquidSessionTokenRequest;
}
export interface V1IdvLoginTicketPostRequest {
    loginTicketRequest?: LoginTicketRequest;
}
export interface V1IdvPlaidTokenSessionPostRequest {
    plaidSessionTokenRequest?: PlaidSessionTokenRequest;
}
export interface V1IdvStartPostRequest {
    authorization?: string;
    startIdvReq?: StartIdvReq;
}
export interface V1IdvUkCookieStartPostRequest {
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvUkKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvUkKycPutPostRequest {
    plaidPutKycReq?: PlaidPutKycReq;
}
export interface V1IdvUkStartPostRequest {
    authorization?: string;
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvUsCookieStartPostRequest {
    plaidStartIdvRequest?: PlaidStartIdvRequest;
}
export interface V1IdvUsKycGetPostRequest {
    authorization?: string;
    plaidGetKycReq?: PlaidGetKycReq;
}
export interface V1IdvUsKycPutPostRequest {
    plaidPutKycReq?: PlaidPutKycReq;
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
    v1IdvCaCookieStartPostRaw(requestParameters: V1IdvCaCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvCaCookieStartPost(requestParameters?: V1IdvCaCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvCaHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvCaHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvCaKycGetPostRaw(requestParameters: V1IdvCaKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvCaKycGetPost(requestParameters?: V1IdvCaKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvCaKycPutPostRaw(requestParameters: V1IdvCaKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;
    v1IdvCaKycPutPost(requestParameters?: V1IdvCaKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;
    v1IdvCaStartPostRaw(requestParameters: V1IdvCaStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvCaStartPost(requestParameters?: V1IdvCaStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvCnHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvCnHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvCnMockResultPostRaw(requestParameters: V1IdvCnMockResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>>;
    v1IdvCnMockResultPost(requestParameters?: V1IdvCnMockResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any>;
    v1IdvCnMockStartPostRaw(requestParameters: V1IdvCnMockStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvMockStartRes>>;
    v1IdvCnMockStartPost(requestParameters?: V1IdvCnMockStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvMockStartRes>;
    v1IdvCnMockTokenPostRaw(requestParameters: V1IdvCnMockTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvMockIssueTokenRes>>;
    v1IdvCnMockTokenPost(requestParameters?: V1IdvCnMockTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvMockIssueTokenRes>;
    v1IdvCnResultPostRaw(requestParameters: V1IdvCnResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>>;
    v1IdvCnResultPost(requestParameters?: V1IdvCnResultPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any>;
    v1IdvCnResultWebPostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>>;
    v1IdvCnResultWebPost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any>;
    v1IdvCnStartPostRaw(requestParameters: V1IdvCnStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvStartRes>>;
    v1IdvCnStartPost(requestParameters?: V1IdvCnStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvStartRes>;
    v1IdvCnTokenPostRaw(requestParameters: V1IdvCnTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TomoIdvIssueTokenRes>>;
    v1IdvCnTokenPost(requestParameters?: V1IdvCnTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TomoIdvIssueTokenRes>;
    v1IdvJpCookieStartPostRaw(requestParameters: V1IdvJpCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LiquidIntegratedAppResponse>>;
    v1IdvJpCookieStartPost(requestParameters?: V1IdvJpCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LiquidIntegratedAppResponse>;
    v1IdvJpHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvJpHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvJpKycGetPostRaw(requestParameters: V1IdvJpKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvJpKycGetPost(requestParameters?: V1IdvJpKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvJpKycPutPostRaw(requestParameters: V1IdvJpKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;
    v1IdvJpKycPutPost(requestParameters?: V1IdvJpKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;
    v1IdvJpNotificationPostRaw(requestParameters: V1IdvJpNotificationPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<EitherStringValue>>;
    v1IdvJpNotificationPost(requestParameters?: V1IdvJpNotificationPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<EitherStringValue>;
    v1IdvJpStartPostRaw(requestParameters: V1IdvJpStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LiquidIntegratedAppResponse>>;
    v1IdvJpStartPost(requestParameters?: V1IdvJpStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LiquidIntegratedAppResponse>;
    v1IdvKycGetPostRaw(requestParameters: V1IdvKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycResp>>;
    v1IdvKycGetPost(requestParameters?: V1IdvKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycResp>;
    v1IdvLiquidTokenSessionPostRaw(requestParameters: V1IdvLiquidTokenSessionPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionToken>>;
    v1IdvLiquidTokenSessionPost(requestParameters?: V1IdvLiquidTokenSessionPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionToken>;
    v1IdvLoginTicketPostRaw(requestParameters: V1IdvLoginTicketPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LoginTicketResponse>>;
    v1IdvLoginTicketPost(requestParameters?: V1IdvLoginTicketPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LoginTicketResponse>;
    v1IdvPlaidTokenSessionPostRaw(requestParameters: V1IdvPlaidTokenSessionPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionToken>>;
    v1IdvPlaidTokenSessionPost(requestParameters?: V1IdvPlaidTokenSessionPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionToken>;
    v1IdvStartPostRaw(requestParameters: V1IdvStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StartIdvResp>>;
    v1IdvStartPost(requestParameters?: V1IdvStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StartIdvResp>;
    v1IdvUkCookieStartPostRaw(requestParameters: V1IdvUkCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUkCookieStartPost(requestParameters?: V1IdvUkCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvUkHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvUkHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvUkKycGetPostRaw(requestParameters: V1IdvUkKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvUkKycGetPost(requestParameters?: V1IdvUkKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvUkKycPutPostRaw(requestParameters: V1IdvUkKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;
    v1IdvUkKycPutPost(requestParameters?: V1IdvUkKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;
    v1IdvUkStartPostRaw(requestParameters: V1IdvUkStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUkStartPost(requestParameters?: V1IdvUkStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvUsCookieStartPostRaw(requestParameters: V1IdvUsCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUsCookieStartPost(requestParameters?: V1IdvUsCookieStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1IdvUsHealthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;
    v1IdvUsHealthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;
    v1IdvUsKycGetPostRaw(requestParameters: V1IdvUsKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKycUnionResp>>;
    v1IdvUsKycGetPost(requestParameters?: V1IdvUsKycGetPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKycUnionResp>;
    v1IdvUsKycPutPostRaw(requestParameters: V1IdvUsKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;
    v1IdvUsKycPutPost(requestParameters?: V1IdvUsKycPutPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;
    v1IdvUsStartPostRaw(requestParameters: V1IdvUsStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlaidStartIdvResp>>;
    v1IdvUsStartPost(requestParameters?: V1IdvUsStartPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlaidStartIdvResp>;
    v1Oauth2TokenPostRaw(requestParameters: V1Oauth2TokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TokenResponse>>;
    v1Oauth2TokenPost(requestParameters: V1Oauth2TokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TokenResponse>;
}
