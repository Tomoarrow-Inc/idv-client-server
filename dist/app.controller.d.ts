import { AppService } from './app.service';
import type { IdvStartBody, IdvKycGetBody, IdvUsStartBody, GetKycUsBody, PutKycUsBody, IdvUsCookieStartBody, PlaidSessionTokenBody, IdvUkStartBody, GetKycUkBody, PutKycUkBody, IdvUkCookieStartBody, IdvCaStartBody, GetKycCaBody, PutKycCaBody, IdvCaCookieStartBody, IdvJpStartBody, GetKycJpBody, PutKycJpBody, IdvJpCookieStartBody, LiquidSessionTokenBody, IdvCnStartBody, IdvCnTokenBody, IdvCnKycGetBody, IdvCnMockStartBody, IdvCnMockTokenBody, IdvCnMockKycGetBody, LoginTicketBody, TokenResponse } from './sdk';
import type { PlaidStartIdvResp } from './sdk/generated/models/PlaidStartIdvResp';
import type { LiquidIntegratedAppResponse } from './sdk/generated/models/LiquidIntegratedAppResponse';
import type { StartIdvResp } from './sdk/generated/models/StartIdvResp';
import type { GetKycResp } from './sdk/generated/models/GetKycResp';
import type { SessionToken } from './sdk/generated/models/SessionToken';
import type { LoginTicketResponse } from './sdk/generated/models/LoginTicketResponse';
import type { EitherStringValue } from './sdk/generated/models/EitherStringValue';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    issueClientCredentialsToken(): Promise<TokenResponse>;
    idvStart(body: IdvStartBody): Promise<StartIdvResp>;
    idvKycGet(body: IdvKycGetBody): Promise<GetKycResp>;
    idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    getKycUS(body: GetKycUsBody): Promise<{
        [key: string]: string;
    }>;
    putKycUS(body: PutKycUsBody): Promise<void>;
    idvCookieStartUS(body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp>;
    healthUS(): Promise<string>;
    idvStartUK(body: IdvUkStartBody): Promise<PlaidStartIdvResp>;
    getKycUK(body: GetKycUkBody): Promise<{
        [key: string]: string;
    }>;
    putKycUK(body: PutKycUkBody): Promise<void>;
    idvCookieStartUK(body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp>;
    healthUK(): Promise<string>;
    idvStartCA(body: IdvCaStartBody): Promise<PlaidStartIdvResp>;
    getKycCA(body: GetKycCaBody): Promise<{
        [key: string]: string;
    }>;
    putKycCA(body: PutKycCaBody): Promise<void>;
    idvCookieStartCA(body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp>;
    healthCA(): Promise<string>;
    idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    getKycJP(body: GetKycJpBody): Promise<{
        [key: string]: string;
    }>;
    putKycJP(body: PutKycJpBody): Promise<void>;
    idvCookieStartJP(body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse>;
    notificationJP(body: any): Promise<EitherStringValue>;
    healthJP(): Promise<string>;
    idvStartCN(body: IdvCnStartBody): Promise<TomoIdvStartRes>;
    idvTokenCN(body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes>;
    idvKycGetCN(body: IdvCnKycGetBody): Promise<any>;
    idvResultWebCN(): Promise<any>;
    healthCN(): Promise<string>;
    idvMockStartCN(body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes>;
    idvMockTokenCN(body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes>;
    idvMockKycGetCN(body: IdvCnMockKycGetBody): Promise<any>;
    plaidTokenSession(body: PlaidSessionTokenBody): Promise<SessionToken>;
    liquidTokenSession(body: LiquidSessionTokenBody): Promise<SessionToken>;
    loginTicket(body: LoginTicketBody): Promise<LoginTicketResponse>;
}
