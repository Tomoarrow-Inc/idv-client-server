import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { StartIdvResp } from './generated/models/StartIdvResp';
import type { GetKycResp } from './generated/models/GetKycResp';
import type { SessionToken } from './generated/models/SessionToken';
import type { LoginTicketResponse } from './generated/models/LoginTicketResponse';
import type { EitherStringValue } from './generated/models/EitherStringValue';
import type { TomoIdvStartRes } from './generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './generated/models/TomoIdvMockIssueTokenRes';
import type { IdvStartBody, IdvKycGetBody, IdvUsStartBody, GetKycUsBody, PutKycUsBody, IdvUsCookieStartBody, PlaidSessionTokenBody, IdvUkStartBody, GetKycUkBody, PutKycUkBody, IdvUkCookieStartBody, IdvCaStartBody, GetKycCaBody, PutKycCaBody, IdvCaCookieStartBody, IdvJpStartBody, GetKycJpBody, PutKycJpBody, IdvJpCookieStartBody, LiquidSessionTokenBody, IdvCnStartBody, IdvCnTokenBody, IdvCnResultBody, IdvCnMockStartBody, IdvCnMockTokenBody, IdvCnMockResultBody, LoginTicketBody } from './api-contract';
export declare class IdvServerClient {
    private readonly api;
    constructor(config?: Configuration);
    issueToken(params: {
        clientAssertion: string;
        clientAssertionType: string;
        grantType: string;
        resource?: string;
        scope?: string;
    }): Promise<TokenResponse>;
    idvStart(accessToken: string, body: IdvStartBody): Promise<StartIdvResp>;
    idvKycGet(accessToken: string, body: IdvKycGetBody): Promise<GetKycResp>;
    idvStartUS(accessToken: string, body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    getKycUS(accessToken: string, body: GetKycUsBody): Promise<{
        [key: string]: string;
    }>;
    putKycUS(body: PutKycUsBody): Promise<void>;
    idvCookieStartUS(body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp>;
    healthUS(): Promise<string>;
    idvStartUK(accessToken: string, body: IdvUkStartBody): Promise<PlaidStartIdvResp>;
    getKycUK(accessToken: string, body: GetKycUkBody): Promise<{
        [key: string]: string;
    }>;
    putKycUK(body: PutKycUkBody): Promise<void>;
    idvCookieStartUK(body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp>;
    healthUK(): Promise<string>;
    idvStartCA(accessToken: string, body: IdvCaStartBody): Promise<PlaidStartIdvResp>;
    getKycCA(accessToken: string, body: GetKycCaBody): Promise<{
        [key: string]: string;
    }>;
    putKycCA(body: PutKycCaBody): Promise<void>;
    idvCookieStartCA(body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp>;
    healthCA(): Promise<string>;
    idvStartJP(accessToken: string, body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    getKycJP(accessToken: string, body: GetKycJpBody): Promise<{
        [key: string]: string;
    }>;
    putKycJP(body: PutKycJpBody): Promise<void>;
    idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse>;
    notificationJP(body: any): Promise<EitherStringValue>;
    healthJP(): Promise<string>;
    idvStartCN(accessToken: string, body: IdvCnStartBody): Promise<TomoIdvStartRes>;
    idvTokenCN(accessToken: string, body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes>;
    idvResultCN(accessToken: string, body: IdvCnResultBody): Promise<any>;
    idvResultWebCN(): Promise<any>;
    healthCN(): Promise<string>;
    idvMockStartCN(accessToken: string, body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes>;
    idvMockTokenCN(accessToken: string, body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes>;
    idvMockResultCN(accessToken: string, body: IdvCnMockResultBody): Promise<any>;
    plaidTokenSession(body: PlaidSessionTokenBody): Promise<SessionToken>;
    liquidTokenSession(body: LiquidSessionTokenBody): Promise<SessionToken>;
    loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse>;
}
