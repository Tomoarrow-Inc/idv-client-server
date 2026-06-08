import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultApi, Configuration } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { UpstreamResponseFilter } from './upstream-response';

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
