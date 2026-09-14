import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ResetRes } from 'tomo-idv-client-node';
import { AppService } from './app.service';
import {
  CONTRACT_VERSION_HEADER,
  EXPLICIT_SELECTION,
  SDK_VERSION_PARAM,
} from './contract-version';

describe('AppService idv-server requests', () => {
  const originalFetch = global.fetch;
  const originalBaseUrl = process.env.IDV_BASE_URL;

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.IDV_BASE_URL = originalBaseUrl;
    jest.restoreAllMocks();
  });

  const createService = (apiMock: Record<string, jest.Mock>) =>
    new AppService(
      { get: jest.fn(() => 'access-token') } as never,
      apiMock as never,
    );

  /** *Raw SDK 호출의 반환 모양. value() 는 파싱된 body, raw 는 fetch Response. */
  const rawApiResponse = (payload: unknown, versionHeader?: string) => ({
    raw: {
      text: jest
        .fn()
        .mockResolvedValue(
          typeof payload === 'string' ? payload : JSON.stringify(payload),
        ),
      headers: {
        get: jest.fn((name: string) =>
          name.toLowerCase() === 'tomo-api-version'
            ? (versionHeader ?? null)
            : null,
        ),
      },
    },
    value: jest.fn().mockResolvedValue(payload),
  });

  /**
   * SDK 호출에 넘어간 initOverrides 함수를 실제 init 으로 실행해, 최종적으로
   * 어떤 header 가 나가는지 확인한다. 생성 runtime 은 반환 headers 로 기존
   * headers 를 통째로 교체하므로 Authorization 보존까지 같이 본다.
   */
  const resolvedHeaders = async (mock: jest.Mock, callIndex = 0) => {
    const initFn = mock.mock.calls[callIndex][1];
    const result = await initFn({
      init: {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: 'Bearer access-token',
          // 생성 SDK 가 required 파라미터로 미리 넣어둔 header.
          [CONTRACT_VERSION_HEADER]: SDK_VERSION_PARAM,
        },
      },
      context: {},
    });
    return result.headers as Record<string, string>;
  };

  // ── 계약 버전 header ──

  it('sends no version header by default, selecting the legacy contract', async () => {
    // 기본값은 "보내지 않음" 이다. header 부재가 idv-server 의 legacy(고정
    // v1.3.20 = 계약 1.3) 선택 표현이며, BFF 가 1.4 를 주입하면 호출자 모르게
    // 응답 형태가 바뀐다. 생성 SDK 가 required 로 넣어둔 header 도 떼어낸다.
    const apiMock = {
      v1IdvStartPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ start_idv_uri: 'x' })),
    };
    const service = createService(apiMock);

    await service.idvStart({ country: 'us' } as never);

    const headers = await resolvedHeaders(apiMock.v1IdvStartPostRaw);
    expect(headers).not.toHaveProperty(CONTRACT_VERSION_HEADER);
    expect(headers.Authorization).toBe('Bearer access-token');
    expect(headers['Content-Type']).toBe('application/json;charset=utf-8');
  });

  it('satisfies the SDK required parameter on every call', async () => {
    // 재생성된 SDK 는 Tomo_API_Version 없이 호출하면 RequiredError 를 던진다.
    const apiMock = {
      v1IdvStartPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ start_idv_uri: 'x' })),
    };
    const service = createService(apiMock);

    await service.idvStart({ country: 'us' } as never);

    expect(apiMock.v1IdvStartPostRaw.mock.calls[0][0]).toMatchObject({
      Tomo_API_Version: SDK_VERSION_PARAM,
    });
  });

  it('attaches the version header when the caller explicitly selects 1.4', async () => {
    const apiMock = {
      v1IdvStartPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ start_idv_uri: 'x' }, '1.4')),
    };
    const service = createService(apiMock);

    await service.idvStart({ country: 'us' } as never, EXPLICIT_SELECTION);

    const headers = await resolvedHeaders(apiMock.v1IdvStartPostRaw);
    expect(headers[CONTRACT_VERSION_HEADER]).toBe('1.4');
    expect(headers.Authorization).toBe('Bearer access-token');
  });

  it.each(['1.3', '1.3.20', '1.4.0', 'latest', ''])(
    'forwards the caller version %p to idv-server verbatim',
    async (version) => {
      // idv-server 가 거부할 값이라도 BFF 가 미리 거르지 않는다. 걸러버리면
      // 호출자가 실제 400 unsupported_api_version 을 볼 수 없다.
      const apiMock = {
        v1IdvStartPostRaw: jest
          .fn()
          .mockResolvedValue(rawApiResponse({ start_idv_uri: 'x' })),
      };
      const service = createService(apiMock);

      await service.idvStart({ country: 'us' } as never, {
        version,
        omit: false,
      });

      const headers = await resolvedHeaders(apiMock.v1IdvStartPostRaw);
      expect(headers[CONTRACT_VERSION_HEADER]).toBe(version);
    },
  );

  // ── 개별 endpoint ──

  it('uses the SDK client for generic IDV start', async () => {
    global.fetch = jest.fn();
    const body = { user_id: 'user-sdk-start', country: 'us' };
    const apiMock = {
      v1IdvStartPostRaw: jest
        .fn()
        .mockResolvedValue(
          rawApiResponse({ start_idv_uri: 'https://idv.example/start' }, '1.4'),
        ),
    };
    const service = createService(apiMock);

    const result = await service.idvStart(body as never);

    expect(apiMock.v1IdvStartPostRaw.mock.calls[0][0]).toMatchObject({
      StartIdvReq: body,
    });
    expect(result.body).toEqual({ start_idv_uri: 'https://idv.example/start' });
    expect(result.version).toBe('1.4');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses the SDK client for generic IDV result', async () => {
    global.fetch = jest.fn();
    const body = { user_id: 'user-result', country: 'us' };
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ result: {} }, '1.4')),
    };
    const service = createService(apiMock);

    await service.idvResult(body as never);

    expect(apiMock.v1IdvResultPostRaw.mock.calls[0][0]).toMatchObject({
      ResultReq: body,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns the single-result body untouched and echoes the applied version', async () => {
    // Regression guard: 생성 ResultContractResponse 역직렬화는 1.3/1.4 anyOf 를
    // 평탄화해 json['results'].map() 을 무조건 부른다. 단건 응답이면 터지므로
    // BFF 는 그 경로를 우회해야 한다.
    const singleResult = {
      result: {
        auth_id: 'auth-1',
        policy_key: 'policy-1',
        country: 'us',
        result: { full_name: 'Test User' },
      },
    };
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse(singleResult, '1.3')),
    };
    const service = createService(apiMock);

    const result = await service.idvResult({ user_id: 'ppid.x' } as never);

    expect(result.body).toEqual(singleResult);
    expect(result.version).toBe('1.3');
  });

  it('returns the 1.4 list body untouched', async () => {
    const listResult = {
      user_id: 'ppid.x',
      results: [
        {
          auth_id: 'auth-1',
          policy_key: 'policy-1',
          country: 'us',
          result: { full_name: 'Test User' },
          kyc: { schema_version: '1.0' },
        },
      ],
    };
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse(listResult, '1.4')),
    };
    const service = createService(apiMock);

    const result = await service.idvResult(
      { user_id: 'ppid.x' } as never,
      EXPLICIT_SELECTION,
    );

    expect(result.body).toEqual(listResult);
    expect(result.version).toBe('1.4');
  });

  it('leaves version undefined when idv-server sends no version header', async () => {
    // legacy 계약에서는 /v1/idv/result 를 제외한 24개 operation 에 버전
    // 응답 header 가 오지 않는다. 오류가 아니라 정상 동작이다.
    const apiMock = {
      v1IdvResetPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ status: 'reset' })),
    };
    const service = createService(apiMock);

    const result = await service.idvReset({ country: 'us' } as never);

    expect(result.version).toBeUndefined();
  });

  it('uses the SDK client for policy reset', async () => {
    global.fetch = jest.fn();
    const body = {
      country: 'us',
      kyc_policy: { preset: 'basic' },
      user_id: 'user-reset',
    };
    const resetResponse: ResetRes = { status: 'reset' };
    const apiMock = {
      v1IdvResetPostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse(resetResponse, '1.4')),
    };
    const service = createService(apiMock);

    const result = await service.idvReset(body as never);

    expect(apiMock.v1IdvResetPostRaw.mock.calls[0][0]).toMatchObject({
      ResetReq: body,
    });
    expect(result.body).toBe(resetResponse);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses the SDK client for single result delete', async () => {
    global.fetch = jest.fn();
    const body = { user_id: 'ppid.x' };
    const apiMock = {
      v1IdvResultDeletePostRaw: jest
        .fn()
        .mockResolvedValue(rawApiResponse({ status: 'deleted' }, '1.4')),
    };
    const service = createService(apiMock);

    const result = await service.idvResultDelete(body as never);

    expect(apiMock.v1IdvResultDeletePostRaw.mock.calls[0][0]).toMatchObject({
      ResultDeleteReq: body,
    });
    expect(result.body).toEqual({ status: 'deleted' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses the SDK client for bulk result delete', async () => {
    global.fetch = jest.fn();
    const body = { user_ids: ['ppid.x', 'ppid.y'] };
    const apiMock = {
      v1IdvResultBulkDeletePostRaw: jest.fn().mockResolvedValue(
        rawApiResponse(
          { results: [{ status: 'deleted' }, { status: 'not_deletable' }] },
          '1.4',
        ),
      ),
    };
    const service = createService(apiMock);

    const result = await service.idvResultBulkDelete(body as never);

    expect(apiMock.v1IdvResultBulkDeletePostRaw.mock.calls[0][0]).toMatchObject({
      ResultBulkDeleteReq: body,
    });
    expect(result.body).toEqual({
      results: [{ status: 'deleted' }, { status: 'not_deletable' }],
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── raw proxy ──

  it('uses transparent fetch proxy for deprecated compatibility routes', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example';
    const body = { user_id: 'user-compat', country: 'us' };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn((name: string) =>
          name.toLowerCase() === 'tomo-api-version'
            ? '1.4'
            : 'application/json',
        ),
      },
      text: jest.fn().mockResolvedValue('{"status":"forwarded"}'),
    });
    global.fetch = fetchMock;
    const service = createService({});

    const result = await service.proxyPost('/v1/idv/kyc/get', body);

    expect(result.body).toEqual({ status: 'forwarded' });
    expect(result.version).toBe('1.4');
    // 기본값은 미전송이다. raw proxy 도 같은 규칙을 쓴다.
    expect(fetchMock).toHaveBeenCalledWith('https://idv.example/v1/idv/kyc/get', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer access-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  });

  it('attaches the version header on the raw proxy for an explicit selection', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn(() => 'application/json') },
      text: jest.fn().mockResolvedValue('{}'),
    });
    global.fetch = fetchMock;
    const service = createService({});

    await service.proxyPost('/v1/idv/us/start', {}, EXPLICIT_SELECTION);

    expect(fetchMock.mock.calls[0][1].headers[CONTRACT_VERSION_HEADER]).toBe(
      '1.4',
    );
  });

  // ── 정적 회귀 검사 ──

  it('routes every SDK endpoint through a *Raw call so the applied version is visible', () => {
    // 25개 operation 전부가 버전 게이트를 거치므로, 어느 endpoint 를 불러도
    // 적용된 계약을 호출자가 볼 수 있어야 한다.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    for (const method of [
      'v1Oauth2TokenPostRaw',
      'v1IdvStartPostRaw',
      'v1IdvResultPostRaw',
      'v1IdvResetPostRaw',
      'v1IdvResultDeletePostRaw',
      'v1IdvResultBulkDeletePostRaw',
    ]) {
      expect(source).toContain(`this.api.${method}(`);
    }
    expect(source).toMatch(/\bproxyPost\s*\(/);
  });

  it('applies the contract selection to every upstream call site', () => {
    // contractInit 을 빠뜨린 SDK 호출이 있으면 그 endpoint 만 SDK 가 넣은
    // 1.4 header 로 나가 25개 operation 사이에 조용한 불일치가 생긴다.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');
    const sdkCalls = source.match(/this\.api\.\w+\(/g) ?? [];
    const contractInits = source.match(/this\.contractInit\(selection\)/g) ?? [];
    const requiredParams =
      source.match(/Tomo_API_Version: SDK_VERSION_PARAM/g) ?? [];

    expect(sdkCalls.length).toBeGreaterThanOrEqual(6);
    expect(contractInits).toHaveLength(sdkCalls.length);
    expect(requiredParams).toHaveLength(sdkCalls.length);
  });

  it('keeps AppService free of Old-suffixed legacy functions', () => {
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\b[A-Za-z0-9_]+Old\s*\(/);
    expect(source).not.toContain('Old problem');
  });

  it('keeps AppService free of deprecated SDK compatibility methods', () => {
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\bidvKycGet\s*\(/);
    expect(source).not.toMatch(/\bidvStartCN\s*\(/);
    expect(source).not.toMatch(/\bidvCountry(Start|KycGet)\s*\(/);
    expect(source).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
    expect(source).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
  });
});
