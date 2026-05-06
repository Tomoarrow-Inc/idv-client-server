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

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: DefaultApi,
      useFactory: () =>
        new DefaultApi(new Configuration({ basePath: resolveBaseUrl() })),
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
