import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';
import { IdvServerClient } from './idvServer/idvServerClient';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [IdvServerClient, AppService, StateService],
})
export class AppModule {}
