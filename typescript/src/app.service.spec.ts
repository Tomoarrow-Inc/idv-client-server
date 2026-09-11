import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ResetRes } from 'tomo-idv-client-node';
import { AppService } from './app.service';

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

  it('uses the SDK client for generic IDV start', async () => {
    // Verifies the BFF sends /v1/idv/start through tomo-idv-client-node,
    // not a raw fetch proxy.
    global.fetch = jest.fn();
    const body = {
      user_id: 'user-sdk-start',
      country: 'us',
      callback_url: 'https://client.example/callback',
      email: 'user-sdk-start@example.com',
    };
    const apiMock = {
      v1IdvStartPost: jest
        .fn()
        .mockResolvedValue({ start_idv_uri: 'https://idv.example/start' }),
    };
    const service = createService(apiMock);

    await service.idvStart(body as never);

    expect(apiMock.v1IdvStartPost).toHaveBeenCalledWith({
      StartIdvReq: body,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  const rawResultResponse = (
    payload: string,
    versionHeader?: string,
  ): { raw: { text: jest.Mock; headers: { get: jest.Mock } } } => ({
    raw: {
      text: jest.fn().mockResolvedValue(payload),
      headers: {
        get: jest.fn((name: string) =>
          name.toLowerCase() === 'tomo-api-version'
            ? (versionHeader ?? null)
            : null,
        ),
      },
    },
  });

  it('uses the SDK client for generic IDV result', async () => {
    // Verifies the public /v1/idv/result endpoint is wired through the
    // generated SDK request path instead of raw fetch.
    global.fetch = jest.fn();
    const body = { user_id: 'user-result', country: 'us' };
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawResultResponse('{"result":{}}', '1.3')),
    };
    const service = createService(apiMock);

    await service.idvResult(body as never);

    expect(apiMock.v1IdvResultPostRaw).toHaveBeenCalledWith({
      ResultReq: body,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('omits Tomo-API-Version when the caller did not send one', async () => {
    // The default contract belongs to idv-server. Injecting a BFF-side default
    // would silently pin callers to whichever version the BFF happens to pick.
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawResultResponse('{"result":{}}', '1.3')),
    };
    const service = createService(apiMock);

    await service.idvResult({ user_id: 'user-result' } as never, undefined);

    const sent = apiMock.v1IdvResultPostRaw.mock.calls[0][0];
    expect(Object.keys(sent)).toEqual(['ResultReq']);
    expect(sent).not.toHaveProperty('Tomo_API_Version');
  });

  it.each(['1.3', '1.4', '1.3.0'])(
    'forwards Tomo-API-Version %s to idv-server verbatim',
    async (version) => {
      // Unsupported values are rejected by idv-server with 400. The BFF must
      // not pre-filter them, otherwise callers cannot see the real error.
      const apiMock = {
        v1IdvResultPostRaw: jest
          .fn()
          .mockResolvedValue(rawResultResponse('{"result":{}}', version)),
      };
      const service = createService(apiMock);

      await service.idvResult({ user_id: 'user-result' } as never, version);

      expect(apiMock.v1IdvResultPostRaw).toHaveBeenCalledWith({
        ResultReq: { user_id: 'user-result' },
        Tomo_API_Version: version,
      });
    },
  );

  it('returns the single-result body untouched and echoes the applied version', async () => {
    // Regression guard: the generated ResultContractResponse deserializer
    // flattens the 1.3/1.4 anyOf and calls json['results'].map() unconditionally,
    // so a single-result body would throw. The BFF must bypass it.
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
        .mockResolvedValue(rawResultResponse(JSON.stringify(singleResult), '1.3')),
    };
    const service = createService(apiMock);

    const result = await service.idvResult({ user_id: 'ppid.x' } as never, '1.3');

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
        .mockResolvedValue(rawResultResponse(JSON.stringify(listResult), '1.4')),
    };
    const service = createService(apiMock);

    const result = await service.idvResult({ user_id: 'ppid.x' } as never, '1.4');

    expect(result.body).toEqual(listResult);
    expect(result.version).toBe('1.4');
  });

  it('leaves version undefined when idv-server sends no version header', async () => {
    const apiMock = {
      v1IdvResultPostRaw: jest
        .fn()
        .mockResolvedValue(rawResultResponse('{"result":{}}')),
    };
    const service = createService(apiMock);

    const result = await service.idvResult({ user_id: 'ppid.x' } as never);

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
      v1IdvResetPost: jest.fn().mockResolvedValue(resetResponse),
    };
    const service = createService(apiMock);

    const result = await service.idvReset(body as never);

    expect(apiMock.v1IdvResetPost).toHaveBeenCalledWith({
      ResetReq: body,
    });
    expect(result).toBe(resetResponse);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses transparent fetch proxy for deprecated compatibility routes', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example';
    const body = { user_id: 'user-compat', country: 'us' };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: jest.fn(() => 'application/json') },
      text: jest.fn().mockResolvedValue('{"status":"forwarded"}'),
    });
    global.fetch = fetchMock;
    const service = createService({});

    const result = await service.proxyPost('/v1/idv/kyc/get', body);

    expect(result).toEqual({ status: 'forwarded' });
    expect(fetchMock).toHaveBeenCalledWith('https://idv.example/v1/idv/kyc/get', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer access-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  });

  it('keeps public IDV start/result/reset methods on the SDK path', () => {
    // Static regression check: public IDV routes stay on the generated SDK
    // methods. Deprecated compatibility routes use proxyPost.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).toMatch(/\bthis\.api\.v1IdvStartPost\s*\(/);
    expect(source).toMatch(/\bthis\.api\.v1IdvResultPostRaw\s*\(/);
    expect(source).toMatch(/\bthis\.api\.v1IdvResetPost\s*\(/);
    expect(source).toMatch(/\bproxyPost\s*\(/);
  });

  it('keeps AppService free of Old-suffixed legacy functions', () => {
    // Static regression check for the hot-fix cleanup: legacy copies with
    // "Old" suffix must not remain in app.service.ts.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\b[A-Za-z0-9_]+Old\s*\(/);
    expect(source).not.toContain('Old problem');
  });

  it('keeps AppService free of deprecated SDK compatibility methods', () => {
    // Static regression check: deprecated paths are forwarded transparently
    // instead of going through generated SDK methods that can reshape bodies.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\bidvKycGet\s*\(/);
    expect(source).not.toMatch(/\bidvStartCN\s*\(/);
    expect(source).not.toMatch(/\bidvCountry(Start|KycGet)\s*\(/);
    expect(source).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
    expect(source).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
  });
});
