import { StateService } from './state.service';
import { IdvServerClient } from './idvServer/idvServerClient';
import { type GetKycUsBody, type GetKycJpBody, type IdvUsStartBody, type IdvJpStartBody, type IdvStartBody, type GetKycUnionResp, type PlaidStartIdvResp, type LiquidIntegratedAppResponse, type StartIdvResp } from './sdk';
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
    getKycUS(body: GetKycUsBody): Promise<GetKycUnionResp>;
    getKycJP(body: GetKycJpBody): Promise<GetKycUnionResp>;
    idvStartJP(body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse>;
    idvStartUS(body: IdvUsStartBody): Promise<PlaidStartIdvResp>;
    idvStart(body: IdvStartBody): Promise<StartIdvResp>;
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
