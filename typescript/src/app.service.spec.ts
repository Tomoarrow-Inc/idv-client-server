import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppService } from './app.service';

describe('AppService SDK-only idv-server requests', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
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
      Authorization: 'Bearer access-token',
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
      Authorization: 'Bearer access-token',
      GetKycReq: body,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('keeps AppService free of raw fetch upstream request code', () => {
    // Static regression check: AppService must route idv-server traffic through
    // generated SDK methods, so raw fetch/proxyPost must not reappear.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toMatch(/\bproxyPost\s*\(/);
  });

  it('keeps AppService free of Old-suffixed legacy functions', () => {
    // Static regression check for the hot-fix cleanup: legacy copies with
    // "Old" suffix must not remain in app.service.ts.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\b[A-Za-z0-9_]+Old\s*\(/);
    expect(source).not.toContain('Old problem');
  });

  it('keeps AppService free of deprecated IDV compatibility implementations', () => {
    // Static regression check: deprecated SDK methods may still exist in the
    // generated contract, but AppService must not implement those BFF routes.
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\bidvKycGet\s*\(/);
    expect(source).not.toMatch(/\bidvStartCN\s*\(/);
    expect(source).not.toMatch(/\bidvCountry(Start|KycGet)\s*\(/);
    expect(source).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
    expect(source).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
  });
});
