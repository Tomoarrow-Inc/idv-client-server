import { AppService } from './app.service';

describe('AppService transparent request proxy', () => {
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

  it('forwards per-country start body to the same idv-server path without injecting country', async () => {
    // Per-country proxying must preserve the frontend request body exactly;
    // in particular it must not convert this to /v1/idv/start or add country.
    process.env.IDV_BASE_URL = 'http://idv-server.test/';
    const body = {
      user_id: 'user-1',
      callback_url: 'https://client.example/callback',
    };
    const fetchMock = jest.fn(() =>
      Promise.resolve(new Response('{"ok":true}', { status: 200 })),
    );
    global.fetch = fetchMock;
    const service = new AppService(
      { get: jest.fn(() => 'access-token') } as never,
      {} as never,
    );

    await service.idvCountryStart('us', body);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://idv-server.test/v1/idv/us/start');
    expect(JSON.parse(init.body as string)).toEqual(body);
  });

  it('forwards generic start typed kyc_policy body without generated-client filtering', async () => {
    // The public /v1/idv/start policy algebra is not safe to pass through a
    // stale generated SDK serializer: unknown typed policy fields must be
    // preserved exactly for idv-server validation and action routing.
    process.env.IDV_BASE_URL = 'http://idv-server.test/';
    const body = {
      user_id: 'user-typed-policy',
      country: 'us',
      callback_url: 'https://client.example/callback',
      kyc_policy: {
        subject: { kind: 'personal_info' },
        method: 'personal_info_verf',
        owner_assurance: { kind: 'owner_verf', type: 'sms_otp' },
      },
      email: 'user-typed-policy@example.com',
    };
    const fetchMock = jest.fn(() =>
      Promise.resolve(
        new Response('{"start_idv_uri":"https://idv.example/start"}', {
          status: 200,
        }),
      ),
    );
    global.fetch = fetchMock;
    const apiMock = { v1IdvStartPost: jest.fn() };
    const service = new AppService(
      { get: jest.fn(() => 'access-token') } as never,
      apiMock as never,
    );

    await service.idvStart(body as never);

    expect(apiMock.v1IdvStartPost).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://idv-server.test/v1/idv/start');
    expect(JSON.parse(init.body as string)).toEqual(body);
  });

  it('forwards session start typed kyc_policy body without generated-client filtering', async () => {
    // /v1/idv/sessions/start accepts the same public policy shape. The BFF
    // must preserve it as raw JSON so client-facing policy parameters do not
    // depend on generated SDK freshness.
    process.env.IDV_BASE_URL = 'http://idv-server.test/';
    const body = {
      user_id: 'user-session-policy',
      country: 'jp',
      callback_url: 'https://client.example/callback',
      kyc_policy: {
        subject: { kind: 'document', id_type: 'id_card' },
        method: 'government_id_verf',
        owner_assurance: { kind: 'owner_verf', type: 'document_secret' },
      },
      email: 'user-session-policy@example.com',
    };
    const fetchMock = jest.fn(() =>
      Promise.resolve(
        new Response('{"kind":"web_redirect","url":"https://idv.example/start"}', {
          status: 200,
        }),
      ),
    );
    global.fetch = fetchMock;
    const apiMock = { v1IdvSessionsStartPost: jest.fn() };
    const service = new AppService(
      { get: jest.fn(() => 'access-token') } as never,
      apiMock as never,
    );

    await service.idvSessionStart(body as never);

    expect(apiMock.v1IdvSessionsStartPost).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://idv-server.test/v1/idv/sessions/start');
    expect(JSON.parse(init.body as string)).toEqual(body);
  });
});
