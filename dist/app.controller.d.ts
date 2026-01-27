import { AppService, IssueAccessTokenResult } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    issueClientCredentialsToken(): Promise<IssueAccessTokenResult>;
    idvStartUS(body: any): Promise<any>;
    getKycUS(body: any): Promise<any>;
    idvStartJP(body: any): Promise<any>;
    getKycJP(body: any): Promise<any>;
    idvStart(body: any): Promise<any>;
}
