import { IdvServerClient } from './idv-client';
import { Configuration } from './generated/runtime';
import { createClientAssertion } from 'tomo-idv-client-node';

const shouldRun = process.env.RUN_IDV_INTEGRATION_TESTS === 'true';
const describeIf = shouldRun ? describe : describe.skip;

const REQUIRED_ENV = ['TOMO_IDV_CLIENT_ID', 'TOMO_IDV_SECRET', 'IDV_BASE_URL'] as const;

describeIf('IdvServerClient → real idv-server (integration)', () => {
  const clientId = process.env.TOMO_IDV_CLIENT_ID as string;
  const secret = process.env.TOMO_IDV_SECRET as string;
  const baseUrl = (process.env.IDV_BASE_URL ?? 'http://idv-server-ghci').replace(/\/$/, '');

  const ensureRequiredEnv = () => {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required env for integration test: ${missing.join(', ')}`);
    }
  };

  const client = new IdvServerClient(new Configuration({ basePath: baseUrl }));

  const issueToken = async () => {
    const assertion = createClientAssertion({
      client_id: clientId,
      secret_key: secret,
      base_url: baseUrl,
    });

    const token = await client.issueToken({
      clientAssertion: assertion,
      clientAssertionType: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grantType: 'client_credentials',
      scope: 'idv.read',
      resource: 'https://api.tomopayment.com/v1/idv',
    });

    const accessToken = (token as any).access_token ?? (token as any).accessToken;
    expect(typeof accessToken).toBe('string');
    return accessToken as string;
  };

  const uniqueUserId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  beforeAll(() => {
    ensureRequiredEnv();
    jest.setTimeout(60_000);
  });

  it('issues client credentials token via /v1/oauth2/token', async () => {
    const accessToken = await issueToken();
    expect(accessToken.split('.').length).toBeGreaterThanOrEqual(2);
  });

  it('starts US IDV via /v1/idv/us/start', async () => {
    const accessToken = await issueToken();
    const userId = uniqueUserId('sdk-us-start');

    const resp = await client.idvStartUS(accessToken, {
      user_id: userId,
      email: 'sdk-user@example.com',
      callback_url: 'idvexpo://verify',
    });

    const uri = (resp as any).start_idv_uri ?? (resp as any).startIdvUri;
    expect(typeof uri).toBe('string');
    expect(uri).toMatch(/^https?:\/\//);
  });
});
