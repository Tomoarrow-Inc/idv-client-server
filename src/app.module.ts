import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateService } from './state.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, StateService],
})
export class AppModule {}
