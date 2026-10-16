import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createServer, IncomingHttpHeaders, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from './app.module';
import { StateService } from './state.service';
import { configureRequestParsers } from './request-parsers';

const endpoint = '/v1/verify/session-token';

// Exercise actual Nest routing and a real upstream socket. Raw malformed JSON,
// missing bodies and upstream content types must survive both HTTP boundaries.
describe('session token verification transparent HTTP proxy', () => {
  let app: NestExpressApplication;
  let upstream: Server;
  let previousBaseUrl: string | undefined;
  let received: {
    method?: string;
    url?: string;
    headers: IncomingHttpHeaders;
    body: Buffer;
  }[];
  let response: { status: number; contentType?: string; body: string };

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
      res.statusCode = response.status;
      if (response.contentType)
        res.setHeader('Content-Type', response.contentType);
      res.end(response.body);
    });
    await new Promise<void>((resolve) =>
      upstream.listen(0, '127.0.0.1', resolve),
    );
    process.env.IDV_BASE_URL = `http://127.0.0.1:${(upstream.address() as AddressInfo).port}`;
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
    response = {
      status: 200,
      contentType: 'application/json;charset=utf-8',
      body: '{"verified":false}',
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

  it.each([true, false])(
    'preserves 200 and verified=%s without OAuth',
    async (verified) => {
      response.body = ` { "verified" : ${verified} }\n`;
      const sent =
        '{ "session_token": "a.b.c", "extra": [1, null], "unicode": "한글" }';
      const result = await request(app.getHttpServer())
        .post(endpoint)
        .set('Content-Type', 'application/json;charset=utf-8')
        .send(sent)
        .expect(200);
      expect(result.text).toBe(response.body);
      expect(result.body).toEqual({ verified });
      expect(result.headers['content-type']).toBe(response.contentType);
      expect(received).toHaveLength(1);
      expect(received[0]).toMatchObject({
        method: 'POST',
        url: endpoint,
        body: Buffer.from(sent),
      });
      expect(received[0].headers['content-type']).toBe(
        'application/json;charset=utf-8',
      );
      expect(received[0].headers.authorization).toBeUndefined();
    },
  );

  it.each(['', '  not-a-jwt  '])(
    'preserves the token string %j',
    async (session_token) => {
      const sent = JSON.stringify({ session_token });
      await request(app.getHttpServer())
        .post(endpoint)
        .type('json')
        .send(sent)
        .expect(200);
      expect(received[0].body.toString()).toBe(sent);
    },
  );

  it.each([
    '{}',
    '{"session_token":null}',
    '{"session_token":42}',
    'null',
    '42',
    '"token"',
    '[]',
    '{"session_token":',
  ])('forwards invalid request bytes %s and the upstream 400', async (sent) => {
    response = {
      status: 400,
      contentType: 'text/plain;charset=utf-8',
      body: 'Invalid `body`: 세션 토큰 요청\n',
    };
    const result = await request(app.getHttpServer())
      .post(endpoint)
      .type('json')
      .send(sent)
      .expect(400);
    expect(result.text).toBe(response.body);
    expect(result.headers['content-type']).toBe(response.contentType);
    expect(received).toHaveLength(1);
    expect(received[0].body).toEqual(Buffer.from(sent));
  });

  it('forwards a missing body without injecting an object', async () => {
    response = {
      status: 400,
      contentType: 'text/plain',
      body: 'Missing request body',
    };
    const result = await request(app.getHttpServer())
      .post(endpoint)
      .expect(400);
    expect(result.text).toBe(response.body);
    expect(result.headers['content-type']).toBe('text/plain');
    expect(received).toHaveLength(1);
    expect(received[0].body.length).toBe(0);
    expect(received[0].headers['content-type']).toBeUndefined();
  });

  it('preserves the missing content type on Servant validation errors', async () => {
    response = {
      status: 400,
      body: 'Error in $: key "session_token" not found',
    };
    const result = await request(app.getHttpServer())
      .post(endpoint)
      .send({})
      .expect(400);
    expect(result.headers['content-type']).toBeUndefined();
    expect(result.text).toBe(response.body);
  });

  it.each([
    [
      500,
      'application/problem+json',
      '{ "message": "upstream 그대로", "nested": {"x":1} }',
    ],
    [503, 'text/plain; charset=utf-8', 'Unavailable\n'],
    [200, 'text/html', '<html>Unexpected upstream body</html>'],
  ])(
    'preserves upstream status %s and content type %s',
    async (status, contentType, body) => {
      response = {
        status: Number(status),
        contentType: String(contentType),
        body: String(body),
      };
      const result = await request(app.getHttpServer())
        .post(endpoint)
        .send({ session_token: 'x' })
        .expect(Number(status));
      expect(result.text).toBe(body);
      expect(result.headers['content-type']).toBe(contentType);
    },
  );

  it('never forwards inbound OAuth, cookies or version headers even with a cached token', async () => {
    app.get(StateService).set('access_token', 'cached-example-token');
    await request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', 'Bearer browser-example-token')
      .set('Cookie', 'test=example')
      .set('Tomo-API-Version', '1.4')
      .set('X-Tomo-Contract-Selection', '1.4')
      .send({ session_token: 'x' })
      .expect(200);
    expect(received).toHaveLength(1);
    for (const header of [
      'authorization',
      'cookie',
      'tomo-api-version',
      'x-tomo-contract-selection',
    ]) {
      expect(received[0].headers[header]).toBeUndefined();
    }
  });

  it.each([
    ['connection failure', new TypeError('fetch failed')],
    ['timeout', new DOMException('request timed out', 'TimeoutError')],
  ])('keeps %s as a BFF 502 error', async (_label, error) => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);
    const result = await request(app.getHttpServer())
      .post(endpoint)
      .send({ session_token: 'x' })
      .expect(502);
    // Keep rethrowUpstream's existing Error/unknown mapping, including realms.
    expect(result.body.message).toBe(
      error instanceof Error ? error.message : 'Unknown error',
    );
    expect(result.body).not.toHaveProperty('verified');
    expect(received).toHaveLength(0);
  });

  it('does not relax JSON parsing on existing authenticated routes', async () => {
    await request(app.getHttpServer())
      .post('/v1/idv/reset')
      .type('json')
      .send('null')
      .expect(400);
    expect(received).toHaveLength(0);
  });

  it.each([`${endpoint}/`, `${endpoint}?view=raw`])(
    'uses raw parsing for the matched route %s',
    async (path) => {
      response = { status: 400, body: 'Invalid body' };
      await request(app.getHttpServer())
        .post(path)
        .type('json')
        .send('null')
        .expect(400);
      expect(received).toHaveLength(1);
      expect(received[0].url).toBe(endpoint);
      expect(received[0].body.toString()).toBe('null');
    },
  );

  it('publishes the additive endpoint and exact DTOs in the served Swagger source', () => {
    const doc = JSON.parse(
      readFileSync(join(__dirname, 'swagger/sdk.openapi.json'), 'utf8'),
    );
    const operation = doc.paths[endpoint].post;
    expect(
      operation.requestBody.content['application/json;charset=utf-8'].schema
        .$ref,
    ).toBe('#/components/schemas/VerifySessionTokenRequest');
    expect(
      operation.responses['200'].content['application/json;charset=utf-8']
        .schema.$ref,
    ).toBe('#/components/schemas/VerifySessionTokenResponse');
    expect(doc.components.schemas.VerifySessionTokenRequest).toEqual({
      type: 'object',
      required: ['session_token'],
      properties: { session_token: { type: 'string' } },
    });
    expect(doc.components.schemas.VerifySessionTokenResponse).toEqual({
      type: 'object',
      required: ['verified'],
      properties: { verified: { type: 'boolean' } },
    });
  });
});
