/**
 * Purpose
 * - idv-server 는 25개 SDK operation 전부에서 Tomo-API-Version 을 해석한다.
 *   header 부재가 곧 legacy(고정 v1.3.20 = 계약 1.3) 선택이고, 명시 값으로
 *   받아주는 것은 `1.4` 하나뿐이다. `1.3`·빈 값·중복은 400 이다.
 * - BFF 는 투명 전달이다. 호출자가 고르지 않으면 BFF 도 보내지 않는다.
 *
 * Verification
 * - 기본 선택은 header 미전송(legacy)이다.
 * - 호출자 값은 검증 없이 그대로 전달된다.
 * - header 합성이 Authorization·Content-Type 을 보존한다.
 * - 생성 SDK 가 required 로 강제하는 값과 실제 wire 가 분리된다.
 * - 컨트롤러가 적용된 버전을 응답 header 로 에코한다.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ResponseError } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import {
  CONTRACT_VERSION_HEADER,
  DEFAULT_SELECTION,
  EXPLICIT_CONTRACT_VERSION,
  EXPLICIT_SELECTION,
  SDK_CONTRACT_PATHS,
  SDK_VERSION_PARAM,
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
  it('defaults to sending no version header at all', () => {
    // idv-server 는 header 부재를 legacy 계약 선택으로 읽는다. BFF 가 기본값을
    // 주입하면 호출자 모르게 응답 형태가 1.4 로 바뀐다.
    expect(DEFAULT_SELECTION).toEqual({ version: '', omit: true });
    expect(resolveContractSelection({})).toEqual(DEFAULT_SELECTION);
    expect(resolveContractSelection(undefined)).toEqual(DEFAULT_SELECTION);
  });

  it('keeps 1.4 as the only value an explicit selection can name', () => {
    expect(EXPLICIT_CONTRACT_VERSION).toBe('1.4');
    expect(EXPLICIT_SELECTION).toEqual({ version: '1.4', omit: false });
  });

  it.each(['1.4', '1.3', '1.3.20', '1.4.0', 'latest', ''])(
    'passes the caller value %p through without validating it',
    (value) => {
      // 값 검증은 idv-server 의 몫이다. BFF 가 미리 거르면 호출자가 실제
      // 400 unsupported_api_version 을 볼 수 없다.
      expect(
        resolveContractSelection({
          [CONTRACT_VERSION_HEADER.toLowerCase()]: value,
        }),
      ).toEqual({ version: value, omit: false });
    },
  );

  it('joins duplicate version headers so idv-server can reject them', () => {
    expect(
      resolveContractSelection({
        [CONTRACT_VERSION_HEADER.toLowerCase()]: ['1.4', '1.4'],
      }),
    ).toEqual({ version: '1.4,1.4', omit: false });
  });

  it('preserves the other headers when composing the version header', () => {
    const base = {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      [CONTRACT_VERSION_HEADER]: SDK_VERSION_PARAM,
    };

    expect(withContractHeaders(base, EXPLICIT_SELECTION)).toEqual({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      [CONTRACT_VERSION_HEADER]: '1.4',
    });

    // legacy 선택은 SDK 가 넣어둔 header 를 도로 떼어낸다.
    expect(withContractHeaders(base, DEFAULT_SELECTION)).toEqual({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    });
  });

  it('separates the SDK required parameter from the actual wire header', () => {
    // 재생성된 SDK 는 Tomo_API_Version 을 required enum ["1.4"] 로 강제하고
    // 없으면 RequiredError 를 던진다. 그래서 호출부는 항상 이 값을 넘기고,
    // legacy 는 header 를 떼어내는 방식으로만 표현할 수 있다.
    expect(SDK_VERSION_PARAM).toBe('1.4');

    const source = readSource('app.service.ts');
    const sdkCalls = source.match(/this\.api\.\w+\(/g) ?? [];
    const paramUses = source.match(/Tomo_API_Version: SDK_VERSION_PARAM/g) ?? [];

    expect(sdkCalls.length).toBeGreaterThanOrEqual(6);
    expect(paramUses).toHaveLength(sdkCalls.length);
  });

  it('mirrors the 25 gated operations idv-server enumerates', () => {
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
      EXPLICIT_SELECTION,
    );
    expect(res.setHeader).toHaveBeenCalledWith(CONTRACT_VERSION_HEADER, '1.4');
    expect(body).toEqual({ result: {} });
  });

  it('selects legacy when the caller sent no header', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: '1.3' }),
    };
    const controller = new AppController(service as never);

    await controller.idvResult({ user_id: 'ppid.x' } as never, {}, res as never);

    expect(service.idvResult).toHaveBeenCalledWith(
      { user_id: 'ppid.x' },
      DEFAULT_SELECTION,
    );
    // legacy 에서도 /v1/idv/result 는 적용 계약을 1.3 으로 알려준다.
    expect(res.setHeader).toHaveBeenCalledWith(CONTRACT_VERSION_HEADER, '1.3');
  });

  it('sets no version header when idv-server applied no contract', async () => {
    // legacy 경로의 나머지 24개 operation 과 협상 400 이 여기에 해당한다.
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
    const source = readSource('app.controller.ts');
    const routes = source.match(/@Post\(/g) ?? [];
    const forwards = source.match(/return this\.forward\(/g) ?? [];

    expect(routes.length).toBeGreaterThanOrEqual(10);
    expect(forwards).toHaveLength(routes.length);
    expect(source).toContain('resolveContractSelection(headers)');
  });
});
