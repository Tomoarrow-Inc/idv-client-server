import { UrlEncoded } from './types';
import { GrantType, Scope, Resource, ClientAssertionType } from './types';
export interface AccessTokenReqHeaders extends Headers {
    'Content-Type': UrlEncoded;
}
export type AccessTokenReqBody = {
    grant_type: GrantType;
    scope: Scope;
    resource: Resource;
    client_assertion_type: ClientAssertionType;
    client_assertion: string;
};
