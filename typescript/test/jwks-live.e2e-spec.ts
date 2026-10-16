// Public JWKS needs no token or signing-key fixture. Live requests stay opt-in
// and use the same configured upstream for the direct and BFF GET comparison.
const describeLive =
  process.env.RUN_JWKS_LIVE_TESTS === 'true' ? describe : describe.skip;

describeLive('real server and TypeScript BFF public JWKS parity', () => {
  jest.setTimeout(45_000);

  it('preserves public GET status, content type and body without authentication', async () => {
    const upstreamBase = process.env.JWKS_UPSTREAM_URL;
    const bffBase = process.env.JWKS_BFF_URL;
    if (!upstreamBase || !bffBase) {
      throw new Error('JWKS_UPSTREAM_URL and JWKS_BFF_URL are required');
    }
    const responses = await Promise.all(
      [upstreamBase, bffBase].map(async (base) => {
        const response = await fetch(
          `${base.replace(/\/$/, '')}/.well-known/jwks.json`,
          {
            method: 'GET',
            credentials: 'omit',
            cache: 'no-store',
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
      expect(response.status).toBe(200);
      expect(response.contentType).toMatch(/^application\/json(?:\s*;|$)/i);
      const data: unknown = JSON.parse(response.text);
      expect(data).not.toBeNull();
      expect(Array.isArray(data)).toBe(false);
      expect(typeof data).toBe('object');
      const keys = (data as { keys?: unknown }).keys;
      expect(Array.isArray(keys)).toBe(true);
      expect((keys as unknown[]).length).toBeGreaterThan(0);
      for (const key of keys as unknown[]) {
        expect(key).not.toBeNull();
        expect(typeof key).toBe('object');
        expect(Array.isArray(key)).toBe(false);
        expect(key).toMatchObject({
          kty: 'EC',
          crv: 'P-256',
          alg: 'ES256',
          use: 'sig',
        });
        for (const field of ['kid', 'x', 'y']) {
          const value = (key as Record<string, unknown>)[field];
          expect(typeof value).toBe('string');
          expect((value as string).length).toBeGreaterThan(0);
        }
        expect(key).not.toHaveProperty('d');
      }
    }
    // Public key rotation may change these between calls; report that difference
    // rather than pinning kid/x/y. Time-dependent Age/Date are not compared.
    expect(responses[1]).toEqual(responses[0]);
  });
});
