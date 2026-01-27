export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type Endpoint = {
    path: string;
    method: Methods;
};
export declare const contract: {
    readonly access_token: {
        readonly path: "/v1/oauth2/token";
        readonly method: "POST";
    };
    readonly idv_us_start: {
        readonly path: "/v1/idv/us/start";
        readonly method: "POST";
    };
    readonly idv_jp_start: {
        readonly path: "/v1/idv/jp/start";
        readonly method: "POST";
    };
    readonly idv_us_get_result: {
        readonly path: "/v1/idv/us/kyc/get";
        readonly method: "POST";
    };
    readonly idv_jp_get_result: {
        readonly path: "/v1/idv/jp/kyc/get";
        readonly method: "POST";
    };
    readonly idv_start: {
        readonly path: "/v1/idv/start";
        readonly method: "POST";
    };
};
export type Contract = typeof contract;
