import { AppService } from './app.service';
import type { GetKycUsBody, GetKycJpBody, IdvUsStartBody, IdvJpStartBody, IdvStartBody, IdvCnStartBody, IdvCnTokenBody, IdvCnResultBody, IdvCnMockStartBody, IdvCnMockTokenBody, IdvCnMockResultBody, GetKycUnionResp, TokenResponse, PlaidStartIdvResp, LiquidIntegratedAppResponse, StartIdvResp } from './sdk';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    issueClientCredentialsToken(): Promise<TokenResponse>;
    idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    getKycUS(body: GetKycUsBody): Promise<GetKycUnionResp>;
    idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    getKycJP(body: GetKycJpBody): Promise<GetKycUnionResp>;
    idvStart(body: IdvStartBody): Promise<StartIdvResp>;
    idvStartCN(body: IdvCnStartBody): Promise<TomoIdvStartRes>;
    idvTokenCN(body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes>;
    idvResultCN(body: IdvCnResultBody): Promise<any>;
    idvMockStartCN(body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes>;
    idvMockTokenCN(body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes>;
    idvMockResultCN(body: IdvCnMockResultBody): Promise<any>;
}
