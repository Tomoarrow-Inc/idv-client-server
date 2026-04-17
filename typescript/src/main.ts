import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
/**
 * Swagger UI "Try it out" 기본값 주입.
 * 코드에서 드러나는 고정값은 example로 설정하고,
 * 유저 입력이 반드시 필요한 필드(idv_session_id, client_assertion 등)는 비워둔다.
 */
function injectSwaggerExamples(doc: any): void {
  const schemas = doc.components?.schemas;
  if (!schemas) return;

  const USER_ID_US = '7999752903327968491';
  const CALLBACK_URL = 'https://example.com/callback';
  const EMAIL = 'test@example.com';

  const setExample = (schemaName: string, field: string, value: any) => {
    if (schemas[schemaName]?.properties?.[field]) {
      schemas[schemaName].properties[field].example = value;
    }
  };

  // ── OAuth2 (BFF가 자동 생성하므로 참고용) ──
  setExample('TokenRequestForm', 'grant_type', 'client_credentials');
  setExample(
    'TokenRequestForm',
    'client_assertion_type',
    'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  );
  setExample('TokenRequestForm', 'scope', 'idv.read');
  setExample(
    'TokenRequestForm',
    'resource',
    'https://api.tomopayment.com/v1/idv',
  );
  // client_assertion: 비워둠 (BFF가 내부 생성)

  // ── Generic (country-agnostic) ──
  setExample('StartIdvReq', 'user_id', USER_ID_US);
  setExample('StartIdvReq', 'callback_url', CALLBACK_URL);
  setExample('StartIdvReq', 'email', EMAIL);
  setExample('StartIdvReq', 'country', 'us');

  setExample('GetKycReq', 'user_id', USER_ID_US);
  setExample('GetKycReq', 'country', 'us');

  // ── Session (vendor-agnostic) ──
  setExample('SessionStartReq', 'user_id', USER_ID_US);
  setExample('SessionStartReq', 'callback_url', CALLBACK_URL);
  setExample('SessionStartReq', 'email', EMAIL);
  setExample('SessionStartReq', 'country', 'us');

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  const swaggerDoc = JSON.parse(
    readFileSync(
      join(__dirname, 'swagger', 'sdk.openapi.json'),
      'utf-8',
    ),
  );
  swaggerDoc.servers = [{ url: '/', description: 'Current server' }];
  injectSwaggerExamples(swaggerDoc);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  expressApp.get('/test-board', (_req, res) => {
    res.sendFile(
      process.env.TEST_BOARD_PATH ||
        join(__dirname, '..', '..', 'test-board', 'test-board.html'),
    );
  });

  expressApp.get('/test-board/config', (_req, res) => {
    res.json({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      idvServerUrl: process.env.IDV_BASE_URL || '',
      idvAppUrl: process.env.IDV_APP_URL || '',
    });
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
