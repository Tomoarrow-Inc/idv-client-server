import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createServer, IncomingHttpHeaders, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import request from 'supertest';
import { AppModule } from './app.module';
import { StateService } from './state.service';
import { configureRequestParsers } from './request-parsers';

const endpoint = '/.well-known/jwks.json';
const cacheHeaders = {
  'cache-control': 'public, max-age=60',
  etag: '"fixture-public-key"',
  'last-modified': 'Fri, 16 Oct 2026 00:00:00 GMT',
  expires: 'Fri, 16 Oct 2026 00:01:00 GMT',
  age: '12',
  vary: 'Accept-Encoding',
};

// A real Nest route and stub HTTP server prove transport behavior without a
// private key, a token fixture, or a generated SDK method for this public route.
describe('public session JWKS transparent GET proxy', () => {
  let app: NestExpressApplication;
  let upstream: Server;
  let previousBaseUrl: string | undefined;
  let received: {
    method?: string;
    url?: string;
    headers: IncomingHttpHeaders;
    body: Buffer;
  }[];
  let reply: { status: number; headers: Record<string, string>; body: string };

  beforeAll(async () => {
    previousBaseUrl = process.env.IDV_BASE_URL;
    upstream = createServer(async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      received.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: Buffer.concat(chunks),
      });
      res.writeHead(reply.status, reply.headers);
      res.end(reply.body);
    });
    await new Promise<void>((resolve) =>
      upstream.listen(0, '127.0.0.1', resolve),
    );
    process.env.IDV_BASE_URL = `http://127.0.0.1:${(upstream.address() as AddressInfo).port}/`;
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    configureRequestParsers(app);
    await app.init();
  });

  beforeEach(() => {
    received = [];
    reply = {
      status: 200,
      headers: { 'content-type': 'application/json;charset=utf-8' },
      body: ' { "keys" : [] }\n',
    };
    app.get(StateService).delete('access_token');
  });

  afterEach(() => jest.restoreAllMocks());

  afterAll(async () => {
    await app?.close();
    await new Promise<void>((resolve, reject) =>
      upstream.close((error) => (error ? reject(error) : resolve())),
    );
    if (previousBaseUrl === undefined) delete process.env.IDV_BASE_URL;
    else process.env.IDV_BASE_URL = previousBaseUrl;
  });

  it('uses the fixed GET path without OAuth and preserves exact JSON bytes', async () => {
    const result = await request(app.getHttpServer()).get(endpoint).expect(200);
    expect(result.text).toBe(reply.body);
    expect(result.headers['content-type']).toBe(reply.headers['content-type']);
    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({
      method: 'GET',
      url: endpoint,
      body: Buffer.alloc(0),
    });
    expect(received[0].headers.authorization).toBeUndefined();
    expect(received[0].headers['content-type']).toBeUndefined();
  });

  it('discards inbound query, body, auth, cookies, version and conditional headers despite a cached token', async () => {
    app.get(StateService).set('access_token', 'cached-test-token');
    await request(app.getHttpServer())
      .get(`${endpoint}?url=https%3A%2F%2Fexample.test&token=fake`)
      .set('Authorization', 'Bearer browser-test-token')
      .set('Cookie', 'example=true')
      .set('Referer', 'https://example.test/test-board?token=synthetic-callback')
      .set('Tomo-API-Version', '1.4')
      .set('If-None-Match', '"incoming-etag"')
      .send({ session_token: 'ignored-test-body' })
      .expect(200);
    expect(received).toHaveLength(1);
    expect(received[0].url).toBe(endpoint);
    expect(received[0].body.length).toBe(0);
    for (const header of [
      'authorization',
      'cookie',
      'referer',
      'tomo-api-version',
      'if-none-match',
      'content-type',
    ]) {
      expect(received[0].headers[header]).toBeUndefined();
    }
  });

  it.each([404, 500])(
    'preserves upstream %s, error text and content type',
    async (status) => {
      reply = {
        status,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
        body: '<b>서버 오류 그대로</b>\n',
      };
      const result = await request(app.getHttpServer())
        .get(endpoint)
        .expect(status);
      expect(result.text).toBe(reply.body);
      expect(result.headers['content-type']).toBe(
        reply.headers['content-type'],
      );
    },
  );

  it.each([200, 404])(
    'preserves an absent Content-Type for status %s',
    async (status) => {
      reply = { status, headers: {}, body: 'raw bytes without a media type\n' };
      const result = await request(app.getHttpServer())
        .get(endpoint)
        .expect(status);
      expect(result.text).toBe(reply.body);
      expect(result.headers['content-type']).toBeUndefined();
    },
  );

  it.each([200, 500])(
    'forwards only allowed upstream cache headers on status %s',
    async (status) => {
      reply.status = status;
      reply.headers = {
        ...reply.headers,
        ...cacheHeaders,
        'set-cookie': 'upstream=do-not-forward',
        'x-upstream-private': 'not-allowed',
      };
      const result = await request(app.getHttpServer())
        .get(endpoint)
        .expect(status);
      for (const [name, value] of Object.entries(cacheHeaders))
        expect(result.headers[name]).toBe(value);
      expect(result.headers['set-cookie']).toBeUndefined();
      expect(result.headers['x-upstream-private']).toBeUndefined();
    },
  );

  it('adds no cache headers or BFF cache when the upstream provides none', async () => {
    const first = await request(app.getHttpServer()).get(endpoint).expect(200);
    reply.body = '{"keys":[{"kid":"new-public-key"}]}';
    const second = await request(app.getHttpServer()).get(endpoint).expect(200);
    expect(second.text).toBe(reply.body);
    expect(received).toHaveLength(2);
    for (const name of Object.keys(cacheHeaders)) {
      expect(first.headers[name]).toBeUndefined();
      expect(second.headers[name]).toBeUndefined();
    }
  });

  it.each([204, 304])(
    'preserves status %s without adding a response body',
    async (status) => {
      reply = { status, headers: cacheHeaders, body: '' };
      const result = await request(app.getHttpServer())
        .get(endpoint)
        .expect(status);
      expect(result.text).toBe('');
      expect(result.headers['content-type']).toBeUndefined();
      for (const [name, value] of Object.entries(cacheHeaders))
        expect(result.headers[name]).toBe(value);
    },
  );

  it('does not follow redirects or forward an arbitrary upstream destination', async () => {
    reply = {
      status: 302,
      headers: { location: 'https://example.invalid/private' },
      body: '',
    };
    await request(app.getHttpServer()).get(endpoint).expect(302);
    expect(received).toHaveLength(1);
  });

  it('bounds the GET to 30 seconds with manual redirects and no caller options', async () => {
    const signal = new AbortController().signal;
    const timeout = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(signal);
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{"keys":[]}', { status: 200 }));
    await request(app.getHttpServer()).get(endpoint).expect(200);
    expect(timeout).toHaveBeenCalledWith(30_000);
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: 'GET',
      redirect: 'manual',
      signal,
    });
  });

  it.each([
    ['connection failure', new TypeError('fetch failed')],
    ['timeout', new DOMException('request timed out', 'TimeoutError')],
  ])('keeps %s as a BFF 502 response', async (_label, error) => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);
    const result = await request(app.getHttpServer()).get(endpoint).expect(502);
    expect(result.body.message).toBe(
      error instanceof Error ? error.message : 'Unknown error',
    );
    expect(received).toHaveLength(0);
  });
});
