import { AppService, IssueAccessTokenResult } from './app.service';
import type { GetKycUsBody, GetKycJpBody, IdvUsStartBody, IdvJpStartBody, IdvStartBody, GetKycUnionResp, PlaidStartIdvResp, LiquidIntegratedAppResponse, StartIdvResp } from './sdk';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    issueClientCredentialsToken(): Promise<IssueAccessTokenResult>;
    idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    getKycUS(body: GetKycUsBody): Promise<GetKycUnionResp>;
    idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    getKycJP(body: GetKycJpBody): Promise<GetKycUnionResp>;
    idvStart(body: IdvStartBody): Promise<StartIdvResp>;
}
