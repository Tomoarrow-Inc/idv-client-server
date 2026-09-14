/**
 * Purpose
 * - idv-server 는 25개 SDK operation 전부에서 Tomo-API-Version 을 해석하고,
 *   요청 값으로는 `1.4` 하나만 받는다. header 부재는 고정 v1.3.20 legacy
 *   계약이고, `1.3`·빈 값·중복은 400 unsupported_api_version 이다.
 * - BFF 는 고객사 SDK consumer 로서 기본값 1.4 를 붙이되, 호출자가 지정하면
 *   검증 없이 그대로 전달해 실제 400 이 호출자에게 보이게 한다.
 *
 * Verification
 * - 선택 해석: 기본 1.4 / legacy 생략 / 호출자 값 verbatim / 중복 header.
 * - header 합성이 Authorization·Content-Type 을 보존한다.
 * - 컨트롤러가 적용된 버전을 응답 header 로 에코한다.
 * - 협상 400(버전 header 없음)에는 버전 header 를 붙이지 않는다.
 * - 모든 프록시 라우트가 같은 경로를 쓴다.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ResponseError } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import {
  CONTRACT_MODE_HEADER,
  CONTRACT_VERSION_HEADER,
  DEFAULT_CONTRACT_VERSION,
  DEFAULT_SELECTION,
  SDK_CONTRACT_PATHS,
  resolveContractSelection,
  withContractHeaders,
} from './contract-version';
import {
  UpstreamResponseError,
  UpstreamResponseFilter,
  rethrowUpstream,
} from './upstream-response';

const readSource = (name: string) =>
  readFileSync(join(__dirname, name), 'utf8');

const fakeResponse = () => ({ setHeader: jest.fn() });

describe('SDK contract version selection', () => {
  it('defaults to the version the SDK contract requires', () => {
    expect(DEFAULT_CONTRACT_VERSION).toBe('1.4');
    expect(resolveContractSelection({})).toEqual(DEFAULT_SELECTION);
    expect(resolveContractSelection(undefined)).toEqual(DEFAULT_SELECTION);
  });

  it('omits the header when the caller asks for the legacy contract', () => {
    // idv-server 는 header 부재만을 legacy 선택으로 인정한다. "1.3" 을 보내는
    // 것은 400 이므로 legacy 를 고르는 방법이 될 수 없다.
    expect(resolveContractSelection({ [CONTRACT_MODE_HEADER]: 'legacy' }))
      .toEqual({ version: '', omit: true });
    expect(resolveContractSelection({ [CONTRACT_MODE_HEADER]: ' LEGACY ' }))
      .toEqual({ version: '', omit: true });
  });

  it.each(['1.4', '1.3', '1.3.20', '1.4.0', 'latest', ''])(
    'passes the caller value %p through without validating it',
    (value) => {
      expect(
        resolveContractSelection({
          [CONTRACT_VERSION_HEADER.toLowerCase()]: value,
        }),
      ).toEqual({ version: value, omit: false });
    },
  );

  it('joins duplicate version headers so idv-server can reject them', () => {
    // 중복 header 는 서버가 400 MultipleSdkVersions 로 거부한다. BFF 가 하나만
    // 고르면 그 거부를 재현할 수 없다.
    expect(
      resolveContractSelection({
        [CONTRACT_VERSION_HEADER.toLowerCase()]: ['1.4', '1.4'],
      }),
    ).toEqual({ version: '1.4,1.4', omit: false });
  });

  it('lets the legacy mode header win over an explicit version', () => {
    expect(
      resolveContractSelection({
        [CONTRACT_MODE_HEADER]: 'legacy',
        [CONTRACT_VERSION_HEADER.toLowerCase()]: '1.4',
      }),
    ).toEqual({ version: '', omit: true });
  });

  it('preserves the other headers when composing the version header', () => {
    const base = {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      [CONTRACT_VERSION_HEADER]: 'stale',
    };

    expect(withContractHeaders(base, { version: '1.4', omit: false })).toEqual({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      [CONTRACT_VERSION_HEADER]: '1.4',
    });
    expect(withContractHeaders(base, { version: '', omit: true })).toEqual({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    });
  });

  it('mirrors the 25 gated operations idv-server enumerates', () => {
    // idv-server lib/App/Contract/Version.hs sdkOperations 와 같은 집합이다.
    expect(SDK_CONTRACT_PATHS).toHaveLength(25);
    expect(new Set(SDK_CONTRACT_PATHS).size).toBe(25);

    for (const path of [
      '/v1/oauth2/token',
      '/v1/idv/start',
      '/v1/idv/result',
      '/v1/idv/reset',
      '/v1/idv/kyc/get',
      '/v1/idv/result/delete',
      '/v1/idv/result/bulk-delete',
      '/v1/idv/sessions/start',
      '/v1/idv/cn/token',
      '/v1/idv/us/kyc/get',
      '/v1/idv/jp/health',
    ]) {
      expect(SDK_CONTRACT_PATHS).toContain(path);
    }

    // 25개 밖. 게이트를 거치지 않으므로 header 를 보내도 무시된다.
    expect(SDK_CONTRACT_PATHS).not.toContain('/v1/verify/session');
  });
});

describe('result contract version passthrough', () => {
  it('echoes the version idv-server applied', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: '1.4' }),
    };
    const controller = new AppController(service as never);

    const body = await controller.idvResult(
      { user_id: 'ppid.x' } as never,
      { [CONTRACT_VERSION_HEADER.toLowerCase()]: '1.4' },
      res as never,
    );

    expect(service.idvResult).toHaveBeenCalledWith(
      { user_id: 'ppid.x' },
      { version: '1.4', omit: false },
    );
    expect(res.setHeader).toHaveBeenCalledWith(CONTRACT_VERSION_HEADER, '1.4');
    expect(body).toEqual({ result: {} });
  });

  it('applies the default version when the caller sent no header', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: '1.4' }),
    };
    const controller = new AppController(service as never);

    await controller.idvResult({ user_id: 'ppid.x' } as never, {}, res as never);

    expect(service.idvResult).toHaveBeenCalledWith(
      { user_id: 'ppid.x' },
      DEFAULT_SELECTION,
    );
  });

  it('sets no version header when idv-server applied no contract', async () => {
    // legacy 경로의 24개 operation 과 협상 400 이 여기에 해당한다.
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: undefined }),
    };
    const controller = new AppController(service as never);

    await controller.idvResult({ user_id: 'ppid.x' } as never, {}, res as never);

    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it('keeps the applied version on upstream errors', async () => {
    const upstream = {
      status: 403,
      headers: {
        get: jest.fn((name: string) =>
          name === CONTRACT_VERSION_HEADER
            ? '1.4'
            : name === 'content-type'
              ? 'application/json;charset=utf-8'
              : null,
        ),
      },
      text: jest.fn().mockResolvedValue('{"message":"denied"}'),
    };

    await expect(
      rethrowUpstream(new ResponseError(upstream as never, 'error')),
    ).rejects.toMatchObject({
      status: 403,
      body: '{"message":"denied"}',
      versionHeader: '1.4',
    });
  });

  it('writes the version header onto the forwarded error response', () => {
    const send = jest.fn();
    const response = {
      type: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(() => ({ send })),
    };
    const host = { switchToHttp: () => ({ getResponse: () => response }) };

    new UpstreamResponseFilter().catch(
      new UpstreamResponseError(403, '{"message":"denied"}', undefined, '1.4'),
      host as never,
    );

    expect(response.setHeader).toHaveBeenCalledWith(
      CONTRACT_VERSION_HEADER,
      '1.4',
    );
    expect(response.status).toHaveBeenCalledWith(403);
    expect(send).toHaveBeenCalledWith('{"message":"denied"}');
  });

  it('omits the version header on a negotiation failure', () => {
    // idv-server 는 협상 실패 시 계약을 고르지 않았으므로 버전 header 를 붙이지
    // 않는다. BFF 도 없는 것을 만들어내지 않는다.
    const send = jest.fn();
    const response = {
      type: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(() => ({ send })),
    };
    const host = { switchToHttp: () => ({ getResponse: () => response }) };

    new UpstreamResponseFilter().catch(
      new UpstreamResponseError(
        400,
        '{"error":"unsupported_api_version","error_description":"Unsupported Tomo-API-Version; supported version: 1.4"}',
      ),
      host as never,
    );

    expect(response.setHeader).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('routes every proxied endpoint through the shared contract path', () => {
    // idv-server 가 25개 operation 전부를 게이트하므로 라우트별로 규칙이
    // 갈라지면 안 된다. 모든 @Post 핸들러가 forward() 를 거쳐야 한다.
    const source = readSource('app.controller.ts');
    const routes = source.match(/@Post\(/g) ?? [];
    const forwards = source.match(/return this\.forward\(/g) ?? [];

    expect(routes.length).toBeGreaterThanOrEqual(10);
    expect(forwards).toHaveLength(routes.length);
    expect(source).toContain('resolveContractSelection(headers)');
  });
});
