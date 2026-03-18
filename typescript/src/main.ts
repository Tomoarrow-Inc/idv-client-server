import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',          // 모든 도메인 허용
    methods: '*',         // 모든 HTTP 메서드 허용
    allowedHeaders: '*',  // 모든 헤더 허용
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
