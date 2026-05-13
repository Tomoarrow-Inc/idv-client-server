import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppService } from './app.service';
import { UpstreamResponseError } from './upstream-response';

describe('AppService IDV upstream requests', () => {
  const originalFetch = global.fetch;
  const originalBaseUrl = process.env.IDV_BASE_URL;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalBaseUrl === undefined) {
      delete process.env.IDV_BASE_URL;
    } else {
      process.env.IDV_BASE_URL = originalBaseUrl;
    }
    jest.restoreAllMocks();
  });

  const createService = (apiMock: Record<string, jest.Mock> = {}) =>
    new AppService(
      { get: jest.fn(() => 'access-token') } as never,
      apiMock as never,
    );

  it('uses the SDK client for generic IDV start', async () => {
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

  it('proxies legacy country start without mutating the request body', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example/';
    const body = {
      user_id: 'legacy-user',
      callback_url: 'https://client.example/callback',
      unknown_legacy_field: { kept: true },
    };
    global.fetch = jest.fn().mockResolvedValue(
      new Response('{"start_idv_uri":"https://idv.example/start"}', {
        status: 200,
        headers: { 'content-type': 'application/json;charset=utf-8' },
      }),
    );
    const service = createService();

    await expect(service.legacyCountryStart('jp', body)).resolves.toEqual({
      start_idv_uri: 'https://idv.example/start',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://idv.example/v1/idv/jp/start',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer access-token',
        },
        body: JSON.stringify(body),
      },
    );
  });

  it('forwards upstream legacy error status, content type, and body', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example';
    global.fetch = jest.fn().mockResolvedValue(
      new Response('legacy validation failed', {
        status: 400,
        headers: { 'content-type': 'text/plain;charset=utf-8' },
      }),
    );
    const service = createService();

    await expect(
      service.legacyKycGet({ user_id: 'legacy-user', country: 'us' }),
    ).rejects.toMatchObject({
      status: 400,
      body: 'legacy validation failed',
      contentType: 'text/plain;charset=utf-8',
    } satisfies Partial<UpstreamResponseError>);
  });

  it('proxies legacy verify/session without requiring bearer auth', async () => {
    process.env.IDV_BASE_URL = 'https://idv.example';
    const body = { session_id: 'legacy-session' };
    global.fetch = jest.fn().mockResolvedValue(
      new Response('{"verified":false}', {
        status: 200,
        headers: { 'content-type': 'application/json;charset=utf-8' },
      }),
    );
    const service = createService();

    await service.legacyVerifySession(body);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://idv.example/v1/verify/session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
  });

  it('keeps AppService free of Old-suffixed legacy functions', () => {
    const source = readFileSync(join(__dirname, 'app.service.ts'), 'utf8');

    expect(source).not.toMatch(/\b[A-Za-z0-9_]+Old\s*\(/);
    expect(source).not.toContain('Old problem');
  });
});
