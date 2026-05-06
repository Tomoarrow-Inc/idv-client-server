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

  it('uses the SDK client for generic KYC lookup', async () => {
    // The installed SDK contract exposes /v1/idv/kyc/get, so BFF lookup must
    // use v1IdvKycGetPost instead of a raw fetch proxy.
    global.fetch = jest.fn();
    const body = { user_id: 'user-1', country: 'us' };
    const apiMock = {
      v1IdvKycGetPost: jest.fn().mockResolvedValue({ full_name: 'User One' }),
    };
    const service = createService(apiMock);

    await service.idvKycGet(body as never);

    expect(apiMock.v1IdvKycGetPost).toHaveBeenCalledWith({
      Authorization: 'Bearer access-token',
      GetKycReq: body,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['us', 'v1IdvUsStartPost', 'PlaidStartIdvReq'],
    ['uk', 'v1IdvUkStartPost', 'PlaidStartIdvReq'],
    ['ca', 'v1IdvCaStartPost', 'PlaidStartIdvReq'],
    ['jp', 'v1IdvJpStartPost', 'LiquidStartIdvReq'],
    ['cn', 'v1IdvCnStartPost', 'TencentStartReq'],
  ])(
    'uses the SDK client for %s country start',
    async (country, method, key) => {
      // Country start routes are kept only where tomo-idv-client-node exposes a
      // generated SDK method for that country.
      global.fetch = jest.fn();
      const body = {
        user_id: `user-${country}`,
        callback_url: 'https://client.example/callback',
      };
      const apiMock = {
        [method]: jest
          .fn()
          .mockResolvedValue({ start_idv_uri: 'https://idv.example/start' }),
      } as Record<string, jest.Mock>;
      const service = createService(apiMock);

      await service.idvCountryStart(country, body);

      expect(apiMock[method]).toHaveBeenCalledWith({
        Authorization: 'Bearer access-token',
        [key]: body,
      });
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['us', 'v1IdvUsKycGetPost', 'PlaidGetKycReq'],
    ['uk', 'v1IdvUkKycGetPost', 'PlaidGetKycReq'],
    ['ca', 'v1IdvCaKycGetPost', 'PlaidGetKycReq'],
    ['jp', 'v1IdvJpKycGetPost', 'LiquidGetKycReq'],
    ['cn', 'v1IdvCnKycGetPost', 'TencentGetKycReq'],
  ])(
    'uses the SDK client for %s country kyc/get',
    async (country, method, key) => {
      // Country kyc/get routes are implemented only through generated SDK
      // methods for countries that the SDK exposes.
      global.fetch = jest.fn();
      const body = { user_id: `user-${country}` };
      const apiMock = {
        [method]: jest.fn().mockResolvedValue({ status: 'ok' }),
      } as Record<string, jest.Mock>;
      const service = createService(apiMock);

      await service.idvCountryKycGet(country, body);

      expect(apiMock[method]).toHaveBeenCalledWith({
        Authorization: 'Bearer access-token',
        [key]: body,
      });
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

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
});
