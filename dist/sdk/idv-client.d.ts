import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { GetKycUnionResp } from './api-contract';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/models/StartIdvResp';
import type { TomoIdvStartRes } from './generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './generated/models/TomoIdvMockIssueTokenRes';
import type { GetKycUsBody, GetKycJpBody, IdvUsStartBody, IdvJpStartBody, IdvStartBody, IdvCnStartBody, IdvCnTokenBody, IdvCnResultBody, IdvCnMockStartBody, IdvCnMockTokenBody, IdvCnMockResultBody } from './api-contract';
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
    getKycUS(accessToken: string, body: GetKycUsBody): Promise<GetKycUnionResp>;
    getKycJP(accessToken: string, body: GetKycJpBody): Promise<GetKycUnionResp>;
    idvStartJP(accessToken: string, body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    idvStartUS(accessToken: string, body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    idvStart(accessToken: string, body: IdvStartBody): Promise<StartIdvResp>;
    idvStartCN(accessToken: string, body: IdvCnStartBody): Promise<TomoIdvStartRes>;
    idvTokenCN(accessToken: string, body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes>;
    idvResultCN(accessToken: string, body: IdvCnResultBody): Promise<any>;
    idvMockStartCN(accessToken: string, body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes>;
    idvMockTokenCN(accessToken: string, body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes>;
    idvMockResultCN(accessToken: string, body: IdvCnMockResultBody): Promise<any>;
}
