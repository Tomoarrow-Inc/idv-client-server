/**
 * Exercise the real Nest route and installed Node SDK serializer. Regenerating
 * Swagger alone must not hide an SDK silently changing the start id_type union.
 * The BFF preserves unresolved document input for the server to validate; it
 * does not select a document, normalize values, or inject a country.
 */
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Configuration, DefaultApi } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { UpstreamResponseFilter } from './upstream-response';

interface SentRequest {
  url: string;
  method: string | undefined;
  headers: Headers;
  body: unknown;
}

describe('document selection start through the installed SDK', () => {
  let app: INestApplication;
  let sent: SentRequest[];
  let upstream: Response;

  beforeEach(async () => {
    sent = [];
    upstream = new Response(
      JSON.stringify({ start_idv_uri: 'https://app.example.invalid/start' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        StateService,
        { provide: APP_FILTER, useClass: UpstreamResponseFilter },
        {
          provide: DefaultApi,
          useFactory: () =>
            new DefaultApi(
              new Configuration({
                basePath: 'https://upstream.example.invalid',
                accessToken: () => 'document-selection-test-token',
                fetchApi: async (url: string, init: RequestInit) => {
                  sent.push({
                    url: String(url),
                    method: init.method,
                    headers: new Headers(init.headers),
                    body: JSON.parse(String(init.body)),
                  });
                  return upstream;
                },
              }),
            ),
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => app?.close());

  const idTypes = [
    ['omitted', {}],
    ['null', { id_type: null }],
    ['empty', { id_type: '' }],
    ['whitespace', { id_type: '  ' }],
    ['scalar', { id_type: 'passport' }],
    // Normalization, deduplication and validation belong to idv-server.
    ['array', { id_type: [' PASSPORT ', 'id_card', 'passport'] }],
  ] as const;

  it.each(idTypes)(
    'preserves %s id_type without adding a country or separate allowlist',
    async (_name, idType) => {
      const body = {
        user_id: 'customer-user',
        email: 'user@example.invalid',
        kyc_policy: {
          subject: { kind: 'document', ...idType },
          method: 'document_ocr_check',
          owner_assurance: { kind: 'no_owner_assurance' },
        },
        redirect_url_success: 'https://customer.example.invalid/success',
        redirect_url_fail: 'https://customer.example.invalid/failure',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/idv/start')
        .send(body)
        .expect(200);

      expect(sent).toHaveLength(1);
      expect(sent[0].url).toBe('https://upstream.example.invalid/v1/idv/start');
      expect(sent[0].method).toBe('POST');
      expect(sent[0].body).toEqual(body);
      expect(sent[0].body).not.toHaveProperty('country');
      expect(sent[0].body).not.toHaveProperty('allowed_document_id_types');
      expect(sent[0].headers.get('Authorization')).toBe(
        'Bearer document-selection-test-token',
      );
      expect(sent[0].headers.get('Tomo-API-Version')).toBeNull();
      expect(response.body).toEqual({
        start_idv_uri: 'https://app.example.invalid/start',
      });
    },
  );

  it.each(idTypes)(
    'preserves country and explicit contract selection with %s id_type',
    async (_name, idType) => {
      const body = {
        country: 'us',
        kyc_policy: {
          subject: { kind: 'document', ...idType },
          method: 'document_ocr_check',
          owner_assurance: { kind: 'no_owner_assurance' },
        },
      };
      await request(app.getHttpServer())
        .post('/v1/idv/start')
        .set('Tomo-API-Version', '1.4')
        .send(body)
        .expect(200);

      expect(sent[0].body).toEqual(body);
      expect(sent[0].headers.get('Tomo-API-Version')).toBe('1.4');
    },
  );

  it.each([
    {
      kyc_policy: {
        subject: { kind: 'document' },
        method: 'document_ocr_check',
        owner_assurance: { kind: 'no_owner_assurance' },
      },
    },
    {
      country: 'us',
      kyc_policy: {
        subject: { kind: 'document', id_type: 'passport' },
        method: 'document_ocr_check',
        owner_assurance: { kind: 'no_owner_assurance' },
      },
    },
    { kyc_policy: { preset: 'customer-existing-policy' } },
  ])('preserves existing or unrestricted input %j', async (body) => {
    await request(app.getHttpServer())
      .post('/v1/idv/start')
      .send(body)
      .expect(200);

    expect(sent[0].body).toEqual(body);
    expect(sent[0].body).not.toHaveProperty('allowed_document_id_types');
  });

  it.each([{}, { id_type: null }])(
    'preserves optional SMS id_type and extra fields for upstream validation (%j)',
    async (idType) => {
      const body = {
        country: 'us',
        kyc_policy: {
          subject: {
            kind: 'personal_info',
            ...idType,
            unknown_nested_field: 'leave unchanged',
          },
          method: 'personal_info_verf',
          owner_assurance: { kind: 'owner_verf', type: 'sms_otp' },
        },
      };
      await request(app.getHttpServer())
        .post('/v1/idv/start')
        .send(body)
        .expect(200);

      expect(sent[0].body).toEqual(body);
    },
  );

  it('preserves invalid id_type array input and the upstream rejection', async () => {
    const body = {
      kyc_policy: {
        subject: {
          kind: 'document',
          id_type: [' PASSPORT ', 'unknown_document'],
        },
        method: 'document_ocr_check',
        owner_assurance: { kind: 'no_owner_assurance' },
      },
    };
    const error = {
      error: 'invalid_request',
      message: '지원하지 않는 문서 선택입니다.',
      details: { field: 'kyc_policy.subject.id_type' },
    };
    upstream = new Response(JSON.stringify(error), {
      status: 400,
      headers: { 'Content-Type': 'application/problem+json' },
    });

    const response = await request(app.getHttpServer())
      .post('/v1/idv/start')
      .send(body)
      .expect(400);

    expect(sent[0].body).toEqual(body);
    expect(response.body).toEqual(error);
    expect(response.headers['content-type']).toContain('application/problem+json');
  });

  it.each([undefined, '1.4'])(
    'retains retired and unknown input so upstream validation cannot be bypassed (%s)',
    async (version) => {
      const body = {
        kyc_policy: {
          subject: {
            kind: 'document',
            id_type: ['passport', 'id_card'],
            unknown_nested_field: 'preserve for upstream validation',
          },
          method: 'document_ocr_check',
          owner_assurance: { kind: 'no_owner_assurance' },
        },
        allowed_document_id_types: ['driver_license'],
        unknown_top_level_field: { restriction: ['passport'] },
      };
      const error = {
        error: 'invalid_request',
        message: 'The retired field is not accepted.',
        details: { field: 'allowed_document_id_types' },
      };
      upstream = new Response(JSON.stringify(error), {
        status: 400,
        headers: { 'Content-Type': 'application/problem+json' },
      });
      const pending = request(app.getHttpServer()).post('/v1/idv/start');
      if (version) pending.set('Tomo-API-Version', version);
      const response = await pending.send(body).expect(400);

      expect(sent).toHaveLength(1);
      expect(sent[0].body).toEqual(body);
      expect(sent[0].headers.get('Authorization')).toBe(
        'Bearer document-selection-test-token',
      );
      expect(sent[0].headers.get('Tomo-API-Version')).toBe(version ?? null);
      expect(response.body).toEqual(error);
      expect(response.headers['content-type']).toContain('application/problem+json');
    },
  );
});
