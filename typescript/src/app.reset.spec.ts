import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { ResetReq, ResetRes } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('POST /v1/idv/reset', () => {
  let app: INestApplication;
  const resetResponse: ResetRes = { status: 'reset' };
  const idvReset = jest.fn<Promise<ResetRes>, [ResetReq]>();

  beforeEach(async () => {
    idvReset.mockReset().mockResolvedValue(resetResponse);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: { idvReset },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the upstream 200 reset response and forwards the request unchanged', async () => {
    const body: ResetReq = {
      country: 'us',
      kyc_policy: { preset: 'basic' },
      user_id: 'user-reset',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/idv/reset')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ status: 'reset' });
    expect(idvReset).toHaveBeenCalledTimes(1);
    expect(idvReset).toHaveBeenCalledWith(body);
  });

  it('passes the same body object to AppService', async () => {
    const body: ResetReq = {
      country: 'us',
      kyc_policy: { preset: 'basic' },
      user_id: 'user-reset-reference',
    };
    const controller = new AppController({ idvReset } as never);

    await controller.idvReset(body);

    expect(idvReset.mock.calls[0][0]).toBe(body);
  });
});
