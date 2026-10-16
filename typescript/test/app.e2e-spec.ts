import type { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import request from 'supertest';
import { bootstrap } from '../src/main';

// Use the production bootstrap, including parsers and UI registration. The old
// generated Hello World smoke targeted a route that this BFF no longer serves.
describe('production BFF bootstrap (e2e)', () => {
  let app: NestExpressApplication;
  let originalBoardPath: string | undefined;

  beforeAll(async () => {
    originalBoardPath = process.env.TEST_BOARD_PATH;
    process.env.TEST_BOARD_PATH = [
      join(__dirname, '../../test-board/test-board.html'),
      join(__dirname, '../test-board/test-board.html'),
    ].find(existsSync);
    app = await bootstrap(0);
  });

  afterEach(() => jest.restoreAllMocks());

  afterAll(async () => {
    await app.close();
    if (originalBoardPath === undefined) delete process.env.TEST_BOARD_PATH;
    else process.env.TEST_BOARD_PATH = originalBoardPath;
  });

  it('serves the board from its configured path', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-board')
      .expect(200);
    expect(response.text).toContain('KYC Test Board');
    expect(response.text).toContain('/v1/verify/session-token');
    expect(response.text).toContain('JWKS 공개키 조회');
  });

  it('serves Swagger with the new relative endpoint and DTOs', async () => {
    await request(app.getHttpServer()).get('/api-docs/').expect(200);
    const response = await request(app.getHttpServer())
      .get('/api-docs/swagger-ui-init.js')
      .expect(200);
    expect(response.text).toContain('/v1/verify/session-token');
    expect(response.text).toContain('VerifySessionTokenRequest');
    expect(response.text).toContain('VerifySessionTokenResponse');
    expect(response.text).toContain('Current server');
  });

  it('passes malformed JSON through the real bootstrap without OAuth', async () => {
    const upstream = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response('Error in $: not enough input', { status: 400 }),
      );
    const result = await request(app.getHttpServer())
      .post('/v1/verify/session-token')
      .type('json')
      .send('{')
      .expect(400);
    expect(result.text).toBe('Error in $: not enough input');
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream.mock.calls[0][0]).toMatch(/\/v1\/verify\/session-token$/);
    expect(
      Buffer.from(upstream.mock.calls[0][1]?.body as Uint8Array).toString(),
    ).toBe('{');
    expect(upstream.mock.calls[0][1]?.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('serves the public JWKS GET through the production bootstrap', async () => {
    const body = ' { "keys" : [] }\n';
    const upstream = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Cache-Control': 'public, max-age=60',
          Vary: 'Accept-Encoding',
        },
      }),
    );
    const response = await request(app.getHttpServer())
      .get('/.well-known/jwks.json?ignored=true')
      .set('Origin', 'https://example.test')
      .expect(200);
    expect(response.text).toBe(body);
    expect(response.headers['content-type']).toBe(
      'application/json;charset=utf-8',
    );
    expect(response.headers['cache-control']).toBe('public, max-age=60');
    expect(response.headers.vary).toBe('Accept-Encoding');
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream.mock.calls[0][0]).toMatch(/\/\.well-known\/jwks\.json$/);
    const init = upstream.mock.calls[0][1];
    expect(init?.method).toBe('GET');
    expect(init?.redirect).toBe('manual');
    expect(init?.body).toBeUndefined();
    expect(init?.headers).toBeUndefined();
  });
});
