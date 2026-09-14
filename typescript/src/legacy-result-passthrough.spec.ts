/**
 * Purpose
 * - BFF 는 계약 1.3(header 미전송) 응답을 역직렬화 없이 통과시켜야 한다.
 *   재생성된 SDK 의 `ResultRes` 는 1.4 전용 oneOf 이고 두 갈래 모두 `user_id`
 *   를 required 로 요구하므로, 1.3 body 를 넣으면 `FromJSONTyped` 가 `{}` 를
 *   돌려준다 — 조용한 전량 유실이다.
 * - 지금 그 raw 통과를 지키는 것은 주석뿐이다. 이 spec 이 실제 코드 경로로
 *   고정한다.
 *
 * Verification
 * - idv-server 의 독립 golden 8개가 HTTP 응답까지 변형 없이 도달한다.
 * - 1.4 봉투(`user_id`)와 표준 projection(`kyc`)이 섞이지 않는다.
 * - 빈 문자열과 선택 필드 부재가 보존된다.
 * - upstream 으로 나간 요청에 `Tomo-API-Version` 이 없다 (= 1.3 선택).
 * - 적용 계약 버전과 게이트 신호(Vary)가 에코된다.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Configuration, DefaultApi } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { UpstreamResponseFilter } from './upstream-response';
import { CONTRACT_VERSION_HEADER } from './contract-version';

const FIXTURE_DIR = join(
  __dirname,
  '..',
  'test',
  'fixtures',
  'idv-result',
  'v1.3.20',
);

const GOLDENS = [
  'plaid-single',
  'plaid-list',
  'kr-single',
  'kr-list',
  'all-fields-single',
  'all-fields-list',
  'no-optionals-single',
  'no-optionals-list',
];

const readGolden = (name: string) =>
  readFileSync(join(FIXTURE_DIR, `${name}.json`), 'utf8');

/** upstream 으로 실제로 나간 요청을 잡아 두는 fake fetch. */
interface SentRequest {
  url: string;
  headers: Record<string, string>;
}

async function createApp(goldenText: string, sent: SentRequest[]) {
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
              basePath: 'http://upstream.test',
              accessToken: () => 'test-token',
              // 생성 SDK 의 fetch 주입점. 요청 구성(경로·인증·직렬화·required
              // 검증)은 전부 실제 SDK 가 하고, 전송만 가로챈다.
              fetchApi: async (url: string, init: RequestInit) => {
                sent.push({
                  url: String(url),
                  headers: { ...((init.headers ?? {}) as Record<string, string>) },
                });
                return new Response(goldenText, {
                  status: 200,
                  headers: {
                    'content-type': 'application/json;charset=utf-8',
                    [CONTRACT_VERSION_HEADER]: '1.3',
                    Vary: CONTRACT_VERSION_HEADER,
                  },
                });
              },
            }),
          ),
      },
    ],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe('legacy (contract 1.3) result passthrough', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it.each(GOLDENS)(
    'returns the %s golden byte-for-byte',
    async (name) => {
      const goldenText = readGolden(name);
      const golden = JSON.parse(goldenText);
      const sent: SentRequest[] = [];
      app = await createApp(goldenText, sent);

      const response = await request(app.getHttpServer())
        .post('/v1/idv/result')
        .send({ user_id: 'ppid.x' })
        .expect(200);

      // 타입에 걸려 잘리지 않았다.
      expect(response.body).toEqual(golden);
    },
  );

  it.each(GOLDENS)(
    'keeps the %s golden free of 1.4 envelope and standard projection',
    async (name) => {
      const goldenText = readGolden(name);
      const sent: SentRequest[] = [];
      app = await createApp(goldenText, sent);

      const response = await request(app.getHttpServer())
        .post('/v1/idv/result')
        .send({ user_id: 'ppid.x' })
        .expect(200);

      // 1.3 봉투에는 최상위 user_id 가 없다.
      expect(response.body).not.toHaveProperty('user_id');

      const records = response.body.results ?? [response.body.result];
      for (const record of records) {
        // 1.3 record 는 표준 kyc projection 을 담지 않는다.
        expect(record).not.toHaveProperty('kyc');
        expect(Object.keys(record).sort()).toEqual([
          'auth_id',
          'country',
          'policy_key',
          'result',
        ]);
      }
    },
  );

  it('preserves empty-string fields instead of dropping them', async () => {
    // all-fields golden 은 빈 문자열 보존을 검증하는 벡터다. FromJSONTyped 를
    // 태우면 스펙에 선언되지 않은 키가 사라지고, 빈 값 처리도 달라질 수 있다.
    const goldenText = readGolden('all-fields-single');
    const golden = JSON.parse(goldenText);
    const sent: SentRequest[] = [];
    app = await createApp(goldenText, sent);

    const response = await request(app.getHttpServer())
      .post('/v1/idv/result')
      .send({ user_id: 'ppid.x' })
      .expect(200);

    expect(Object.keys(response.body.result.result).sort()).toEqual(
      Object.keys(golden.result.result).sort(),
    );
    expect(response.body.result.result).toEqual(golden.result.result);
  });

  it('keeps absent optional fields absent', async () => {
    // no-optionals golden 은 선택 9개가 모두 없는 벡터다. null 로 채워지면 안 된다.
    const goldenText = readGolden('no-optionals-single');
    const sent: SentRequest[] = [];
    app = await createApp(goldenText, sent);

    const response = await request(app.getHttpServer())
      .post('/v1/idv/result')
      .send({ user_id: 'ppid.x' })
      .expect(200);

    const kyc = response.body.result.result;
    for (const optional of [
      'sex',
      'postal_code',
      'email_address',
      'phone_number',
      'family_name',
      'given_name',
      'city',
      'region',
      'street',
    ]) {
      expect(kyc).not.toHaveProperty(optional);
    }
    expect(kyc.full_name).toBeDefined();
    expect(kyc.date_of_birth).toBeDefined();
  });

  it('sends no version header upstream when the caller selected 1.3', async () => {
    // 계약 1.3 의 wire 표현은 "header 를 보내지 않는 것" 이다. 생성 SDK 가
    // required 로 넣어둔 값을 contractInit 이 다시 떼어내는지 확인한다.
    const goldenText = readGolden('plaid-single');
    const sent: SentRequest[] = [];
    app = await createApp(goldenText, sent);

    await request(app.getHttpServer())
      .post('/v1/idv/result')
      .send({ user_id: 'ppid.x' })
      .expect(200);

    expect(sent).toHaveLength(1);
    expect(sent[0].url).toBe('http://upstream.test/v1/idv/result');
    expect(sent[0].headers).not.toHaveProperty(CONTRACT_VERSION_HEADER);
    // BFF 소유 header 는 살아 있어야 한다.
    expect(sent[0].headers.Authorization).toBe('Bearer test-token');
  });

  it('forwards the version header when the caller selected 1.4', async () => {
    const goldenText = readGolden('plaid-single');
    const sent: SentRequest[] = [];
    app = await createApp(goldenText, sent);

    await request(app.getHttpServer())
      .post('/v1/idv/result')
      .set(CONTRACT_VERSION_HEADER, '1.4')
      .send({ user_id: 'ppid.x' })
      .expect(200);

    expect(sent[0].headers[CONTRACT_VERSION_HEADER]).toBe('1.4');
  });

  it('echoes the applied contract and the gate signal', async () => {
    const goldenText = readGolden('plaid-single');
    const sent: SentRequest[] = [];
    app = await createApp(goldenText, sent);

    const response = await request(app.getHttpServer())
      .post('/v1/idv/result')
      .send({ user_id: 'ppid.x' })
      .expect(200);

    expect(response.headers['tomo-api-version']).toBe('1.3');
    expect(response.headers['vary']).toContain(CONTRACT_VERSION_HEADER);
  });
});
