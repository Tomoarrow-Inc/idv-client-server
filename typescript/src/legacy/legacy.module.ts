import { Module } from '@nestjs/common';
import { DefaultApi, Configuration } from 'tomo-idv-client-node';
import { LegacyController } from './legacy.controller';
import { LegacyService } from './legacy.service';

function resolveBaseUrl(): string {
  const raw = process.env.IDV_BASE_URL ?? process.env.IDV_SERVER ?? process.env.IDV_BASEURL ?? 'http://idv-server-ghci';
  return raw.replace(/\/+$/, '');
}

@Module({
  controllers: [LegacyController],
  providers: [
    {
      provide: DefaultApi,
      useFactory: () => new DefaultApi(new Configuration({ basePath: resolveBaseUrl() })),
    },
    LegacyService,
  ],
})
export class LegacyModule {}
