export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type Endpoint = {
    path: string;
    method: Methods;
};
export declare const contract: {
    readonly access_token: {
        readonly path: "/v1/oauth2/token";
        readonly method: Methods;
    };
    readonly idv_us_start: {
        readonly path: "/v1/idv/us/start";
        readonly method: Methods;
    };
    readonly idv_jp_start: {
        readonly path: "/v1/idv/jp/start";
        readonly method: Methods;
    };
    readonly idv_us_get_result: {
        readonly path: "/v1/idv/us/kyc/get";
        readonly method: Methods;
    };
    readonly idv_jp_get_result: {
        readonly path: "/v1/idv/jp/kyc/get";
        readonly method: Methods;
    };
    readonly idv_start: {
        readonly path: "/v1/idv/start";
        readonly method: Methods;
    };
};
export type Contract = typeof contract;
