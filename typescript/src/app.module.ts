import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultApi, Configuration } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { UpstreamResponseFilter } from './upstream-response';
import {
  CONTRACT_VERSION_HEADER,
  DEFAULT_CONTRACT_VERSION,
} from './contract-version';

function resolveBaseUrl(): string {
  const raw =
    process.env.IDV_BASE_URL ??
    process.env.IDV_SERVER ??
    process.env.IDV_BASEURL ??
    'http://idv-server-ghci';
  return raw.replace(/\/+$/, '');
}

function requireAccessToken(stateService: StateService): string {
  const accessToken = stateService.get('access_token') as unknown;
  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error(
      'No access token found. Please call /v1/oauth2/token first.',
    );
  }
  return accessToken;
}

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: DefaultApi,
      inject: [StateService],
      useFactory: (stateService: StateService) =>
        new DefaultApi(
          new Configuration({
            basePath: resolveBaseUrl(),
            accessToken: () => requireAccessToken(stateService),
            // SDK 계약 1.4.0 은 25개 operation 전부에 이 header 를 required
            // enum ["1.4"] 로 요구한다. 고객사 BFF 로서 기본값으로 항상 붙이고,
            // 호출자가 다른 값을 지정하면 요청 단위로 덮어쓴다.
            headers: { [CONTRACT_VERSION_HEADER]: DEFAULT_CONTRACT_VERSION },
          }),
        ),
    },
    {
      provide: APP_FILTER,
      useClass: UpstreamResponseFilter,
    },
    AppService,
    StateService,
  ],
})
export class AppModule {}
