export type ClientAssertionOptions = {
    client_id: string;
    secret_key: string;
    base_url: string;
};
export type BodyOptions = {
    grant_type?: string;
    scope?: string;
    resource?: string;
    client_assertion_type?: string;
};
export declare function createClientAssertion(options: ClientAssertionOptions): string;
export declare function buildTokenRequest(client_assertion: string, options?: BodyOptions): {
    headers: Record<string, string>;
    body: string;
};
