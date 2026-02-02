import { Configuration } from './generated/runtime';
import type { TokenResponse } from './generated/models/TokenResponse';
import type { GetKycUnionResp } from './generated/models/GetKycUnionResp';
import type { LiquidIntegratedAppResponse } from './generated/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/models/StartIdvResp';
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
    getKycUS(accessToken: string, userId: string): Promise<GetKycUnionResp>;
    getKycJP(accessToken: string, userId: string): Promise<GetKycUnionResp>;
    idvStartJP(accessToken: string, userId: string, callbackUrl?: string): Promise<LiquidIntegratedAppResponse>;
    idvStartUS(accessToken: string, userId: string, email?: string, callbackUrl?: string): Promise<PlaidStartIdvResp>;
    idvStart(accessToken: string, userId: string, callbackUrl: string, email: string, country: string): Promise<StartIdvResp>;
}
