import { StateService } from './state.service';
import { IdvServerClient } from './idvServer/idvServerClient';
export type RegistrationResponseBody = {
    client_id: string;
};
export type TokenResponseBody = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
    scopeGranted?: string;
};
export interface IssueAccessTokenResult {
    clientId: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string | null;
    claims?: Record<string, unknown>;
}
export declare class AppService {
    private readonly stateService;
    private readonly idvServerClient;
    constructor(stateService: StateService, idvServerClient: IdvServerClient);
    getHello(): string;
    issueClientCredentialsToken(): Promise<IssueAccessTokenResult>;
    getKycUS(user_id: string, _fields?: string[]): Promise<any>;
    getKycJP(user_id: string, _fields?: string[]): Promise<any>;
    idvStartJP(user_id: string, callback_url?: string): Promise<any>;
    idvStartUS(user_id: string, email?: string, callback_url?: string): Promise<any>;
    idvStart(user_id: string, callback_url: string, email: string, country: string): Promise<any>;
    issueClientCredentialsTokenOld(): Promise<IssueAccessTokenResult>;
    private resolveBaseUrl;
    private safeFetchJson;
    setState(key: string, value: any): void;
    getState(key: string): any;
    hasState(key: string): boolean;
    deleteState(key: string): boolean;
    getAllStates(): Record<string, any>;
    updateState(key: string, updater: (current: any) => any): void;
    incrementState(key: string, amount?: number): number;
    decrementState(key: string, amount?: number): number;
    pushToState(key: string, value: any): void;
    removeFromState(key: string, value: any): void;
    setStateProperty(key: string, property: string, value: any): void;
    removeStateProperty(key: string, property: string): void;
    subscribeToState(key: string, callback: (value: any) => void): () => void;
    getStateCount(): number;
    getStateKeys(pattern?: string): string[];
    backupState(): string;
    restoreState(backup: string): void;
    clearAllStates(): void;
}
