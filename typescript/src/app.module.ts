import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { IdvServerClient } from './sdk/idv-client';
import { IdvOldClient } from './sdk/idv-old-client';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [IdvServerClient, IdvOldClient, AppService, StateService],
})
export class AppModule {}
