import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('uses the SDK client for generic IDV result', async () => {
    // Verifies the new public /v1/idv/result endpoint is wired through the
    // generated SDK method instead of raw fetch.
    global.fetch = jest.fn();
    const body = { user_id: 'user-result', country: 'us' };
    const apiMock = {
      v1IdvResultPost: jest.fn().mockResolvedValue({ status: 'approved' }),
    };
    const service = createService(apiMock);

    await service.idvResult(body as never);

    expect(apiMock.v1IdvResultPost).toHaveBeenCalledWith({
      ResultReq: body,
    });
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

  it('keeps public IDV start/result methods on the SDK path', () => {
    // Static regression check: /v1/idv/start and /v1/idv/result stay on the
    // generated SDK methods. Deprecated compatibility routes use proxyPost.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).toMatch(/\bthis\.api\.v1IdvStartPost\s*\(/);
    expect(source).toMatch(/\bthis\.api\.v1IdvResultPost\s*\(/);
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
