import { AppService, IssueAccessTokenResult } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    issueClientCredentialsTokenSdk(): Promise<IssueAccessTokenResult>;
    idvStartUS(user_id: string): Promise<any>;
    getKycUS(user_id: string, fields?: string | string[]): Promise<any>;
    idvStartJP(user_id: string): Promise<any>;
    getKycJP(user_id: string, fields?: string | string[]): Promise<any>;
    idvStart(user_id: string, callback_url: string, email: string, country: string): Promise<any>;
}
