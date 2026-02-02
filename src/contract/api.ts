export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Endpoint = {
  path: string;
  method: Methods;
};

export const contract = {
  access_token: { path: '/v1/oauth2/token', method: 'POST' as Methods },
  idv_us_start: { path: '/v1/idv/us/start', method: 'POST' as Methods },
  idv_jp_start: { path: '/v1/idv/jp/start', method: 'POST' as Methods },
  idv_us_get_result: { path: '/v1/idv/us/kyc/get', method: 'POST' as Methods },
  idv_jp_get_result: { path: '/v1/idv/jp/kyc/get', method: 'POST' as Methods },
  idv_start: { path: '/v1/idv/start', method: 'POST' as Methods },
} as const satisfies Record<string, Endpoint>;

export type Contract = typeof contract;
