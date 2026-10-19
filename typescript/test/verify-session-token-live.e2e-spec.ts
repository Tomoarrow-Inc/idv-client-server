import { readFileSync } from 'node:fs';

// Opt in independently of OAuth integration tests. Real callback/access tokens
// may only come from caller-provided files; never mint tokens from server keys.
const runLive = process.env.RUN_SESSION_TOKEN_LIVE_TESTS === 'true';
const describeLive = runLive ? describe : describe.skip;
const upstreamBase = process.env.SESSION_TOKEN_UPSTREAM_URL;
const bffBase = process.env.SESSION_TOKEN_BFF_URL;
const tokenFile = process.env.SESSION_TOKEN_FILE;
const accessTokenFile = process.env.SESSION_TOKEN_ACCESS_TOKEN_FILE;

describeLive('real server and TypeScript BFF session token parity', () => {
  jest.setTimeout(120_000);

  async function compare(body: string, status: number, verified?: boolean) {
    if (!upstreamBase || !bffBase)
      throw new Error(
        'SESSION_TOKEN_UPSTREAM_URL and SESSION_TOKEN_BFF_URL are required',
      );
    const responses = await Promise.all(
      [upstreamBase, bffBase].map(async (base) => {
        const response = await fetch(
          `${base.replace(/\/$/, '')}/v1/idv/session-tokens/introspection`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            redirect: 'manual',
            signal: AbortSignal.timeout(30_000),
          },
        );
        return {
          status: response.status,
          contentType: response.headers.get('content-type'),
          text: await response.text(),
        };
      }),
    );
    for (const response of responses) {
      expect(response.status).toBe(status);
      if (verified !== undefined) {
        // Assertions must never print an unexpected body that could echo tokens.
        let data: unknown;
        try {
          data = JSON.parse(response.text);
        } catch {
          throw new Error('Expected a JSON verification response');
        }
        const matches =
          data !== null &&
          typeof data === 'object' &&
          Object.keys(data).length === 1 &&
          'verified' in data &&
          data.verified === verified;
        expect(matches).toBe(true);
      }
    }
    expect(responses[1].contentType).toBe(responses[0].contentType);
    expect(responses[1].text === responses[0].text).toBe(true);
  }

  it.each(['not-a-jwt', ''])(
    'returns false for invalid string %j',
    async (session_token) => {
      await compare(JSON.stringify({ session_token }), 200, false);
    },
  );

  it.each([
    '{}',
    '{"session_token":null}',
    '{"session_token":42}',
    'null',
    '{',
  ])('preserves 400 for %s', async (body) => compare(body, 400));

  (tokenFile ? it : it.skip)(
    'verifies a fresh same-environment callback twice and rejects signature tampering',
    async () => {
      const session_token = readFileSync(tokenFile!, 'utf8').trim();
      if (session_token.split('.').length !== 3)
        throw new Error(
          'SESSION_TOKEN_FILE must contain one compact callback JWT',
        );
      const body = JSON.stringify({ session_token });
      await compare(body, 200, true);
      await compare(body, 200, true);
      const parts = session_token.split('.');
      parts[2] = (parts[2][0] === 'A' ? 'B' : 'A') + parts[2].slice(1);
      await compare(
        JSON.stringify({ session_token: parts.join('.') }),
        200,
        false,
      );
    },
  );

  (accessTokenFile ? it : it.skip)(
    'rejects a real OAuth access token as a session token',
    async () => {
      await compare(
        JSON.stringify({
          session_token: readFileSync(accessTokenFile!, 'utf8').trim(),
        }),
        200,
        false,
      );
    },
  );
});
