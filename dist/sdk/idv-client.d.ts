import { Configuration } from './generated/idv-client-server/runtime';
import type { TokenResponse } from './generated/idv-client-server/models/TokenResponse';
import type { GetKycUnionResp } from './generated/idv-client-server/models/GetKycUnionResp';
import type { LiquidIntegratedAppResponse } from './generated/idv-client-server/models/LiquidIntegratedAppResponse';
import type { PlaidStartIdvResp } from './generated/idv-client-server/models/PlaidStartIdvResp';
import type { StartIdvResp } from './generated/idv-client-server/models/StartIdvResp';
import type { GetKycUsBody, GetKycJpBody, IdvUsStartBody, IdvJpStartBody, IdvStartBody } from './api-contract';
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
}
