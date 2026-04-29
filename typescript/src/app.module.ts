import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultApi, Configuration } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockController } from './mock/mock.controller';
import { MockService } from './mock/mock.service';
import { StateService } from './state.service';
import { LegacyModule } from './legacy/legacy.module';
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
  imports: [LegacyModule],
  controllers: [AppController, MockController],
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
    MockService,
    StateService,
  ],
})
export class AppModule {}
