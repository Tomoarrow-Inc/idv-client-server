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
      kyc_policy_id: '',
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
});
