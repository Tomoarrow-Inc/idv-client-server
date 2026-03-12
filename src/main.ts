import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildWechatLoginErrorRedirectPath,
  buildWechatLoginSuccessRedirectPath,
  buildWechatMockClientLoginCallbackPath,
  MOCK_WECHAT_LOGIN_PROFILE,
  renderWechatMockClientLoginHtml,
} from './wechat-login';

/**
 * Swagger UI "Try it out" 기본값 주입.
 * 코드에서 드러나는 고정값은 example로 설정하고,
 * 유저 입력이 반드시 필요한 필드(idv_session_id, client_assertion 등)는 비워둔다.
 */
function injectSwaggerExamples(doc: any): void {
  const schemas = doc.components?.schemas;
  if (!schemas) return;

  // 국가별 테스트 user_id (CLAUDE.md 참조)
  const USER_ID_US = '7999752903327968491';
  const USER_ID_JP = '7999752903327968498';
  const USER_ID_CN = '799975290332796849300000000000007';
  const CALLBACK_URL = 'https://example.com/callback';
  const REDIRECT_URL = 'https://example.com/redirect';
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

  // ── US/UK/CA (Plaid) ──
  setExample('PlaidStartIdvRequest', 'user_id', USER_ID_US);
  setExample('PlaidStartIdvRequest', 'callback_url', CALLBACK_URL);
  setExample('PlaidStartIdvRequest', 'email', EMAIL);

  setExample('PlaidGetKycReq', 'user_id', USER_ID_US);
  // fields: optional, 비워둠

  setExample('PlaidPutKycReq', 'user_id', USER_ID_US);
  // idv_session_id: 비워둠 (start 응답에서 획득)

  setExample('PlaidSessionTokenRequest', 'user_id', USER_ID_US);
  // idv_session_id: 비워둠

  // ── JP (Liquid) ──
  setExample('LiquidStartIdvRequest', 'user_id', USER_ID_JP);
  setExample('LiquidStartIdvRequest', 'callback_url', CALLBACK_URL);

  setExample('LiquidGetKycReq', 'user_id', USER_ID_JP);
  // fields: optional, 비워둠

  setExample('LiquidPutKycReq', 'user_id', USER_ID_JP);

  setExample('LiquidSessionTokenRequest', 'user_id', USER_ID_JP);

  // ── CN (TomoIdv) ──
  setExample('TomoIdvStartReq', 'user_id', USER_ID_CN);
  setExample('TomoIdvStartReq', 'redirect_url', REDIRECT_URL);

  setExample('TomoIdvIssueTokenReq', 'user_id', USER_ID_CN);

  setExample('TomoIdvGetResultReq', 'user_id', USER_ID_CN);

  // ── CN Mock ──
  setExample('TomoIdvMockStartReq', 'user_id', USER_ID_CN);
  setExample('TomoIdvMockStartReq', 'redirect_url', REDIRECT_URL);

  setExample('TomoIdvMockIssueTokenReq', 'user_id', USER_ID_CN);

  setExample('TomoIdvMockGetResultReq', 'user_id', USER_ID_CN);

  // ── LoginTicket: 비워둠 (외부 플로우에서 획득) ──

  // ── Google Social KYC ──
  setExample('GoogleStartReq', 'callback_url', CALLBACK_URL);
  setExample('GoogleStartReq', 'login_hint', '');
}

// 문제점: 기존 bootstrap은 실제 WeChat callback만 구성되어 있어 mock Step 0이 브라우저 내부 상태 변경에 머물렀고,
// app id/app secret 없이 실제와 같은 login -> callback -> test-board 구조를 검증할 수 없었다.
// 개선 함수: bootstrap
async function bootstrapOld() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // 모든 도메인 허용
    methods: '*', // 모든 HTTP 메서드 허용
    allowedHeaders: '*', // 모든 헤더 허용
  });

  // Swagger UI Test Board
  const swaggerDoc = JSON.parse(
    readFileSync(
      join(__dirname, 'swagger', 'client-server.openapi.json'),
      'utf-8',
    ),
  );
  swaggerDoc.servers = [{ url: '/', description: 'Current server' }];
  injectSwaggerExamples(swaggerDoc);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  // Test Board (Social KYC interactive test page)
  expressApp.get('/test-board', (_req, res) => {
    res.sendFile(join(__dirname, 'swagger', 'test-board.html'));
  });

  // Test Board config (provides GOOGLE_CLIENT_ID and WECHAT_CLIENT_APP_ID to frontend)
  expressApp.get('/test-board/config', (_req, res) => {
    res.json({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      wechatAppId: process.env.WECHAT_CLIENT_APP_ID || '',
      idvServerUrl: process.env.IDV_BASE_URL || '',
      idvAppUrl: process.env.IDV_APP_URL || '',
    });
  });

  // WeChat Login callback — exchanges code for access_token + userinfo, redirects back to test-board
  // Environment variables required:
  //   WECHAT_CLIENT_APP_ID     — WeChat Open Platform AppID (for client-side QR login)
  //   WECHAT_CLIENT_APP_SECRET — WeChat Open Platform AppSecret (for server-side code exchange)
  expressApp.get('/wechat/login/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.redirect('/test-board?wechat_error=no_code');
    }

    try {
      const appId = process.env.WECHAT_CLIENT_APP_ID || '';
      const appSecret = process.env.WECHAT_CLIENT_APP_SECRET || '';

      // Step 1: Exchange code for access_token
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
      const tokenRes = await fetch(tokenUrl);
      const tokenData = await tokenRes.json();

      if (tokenData.errcode) {
        return res.redirect(
          `/test-board?wechat_error=${encodeURIComponent(tokenData.errmsg || 'token_exchange_failed')}`,
        );
      }

      // Step 2: Get user info
      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}`;
      const userRes = await fetch(userInfoUrl);
      const userData = await userRes.json();

      if (userData.errcode) {
        return res.redirect(
          `/test-board?wechat_error=${encodeURIComponent(userData.errmsg || 'userinfo_failed')}`,
        );
      }

      // Redirect back to test-board with user info as query params
      const params = new URLSearchParams({
        wechat_login: 'success',
        wechat_unionid: userData.unionid || '',
        wechat_openid: userData.openid || '',
        wechat_nickname: userData.nickname || '',
        wechat_headimgurl: userData.headimgurl || '',
      });

      res.redirect(`/test-board?${params.toString()}`);
    } catch (e: any) {
      res.redirect(
        `/test-board?wechat_error=${encodeURIComponent(e.message || 'unknown_error')}`,
      );
    }
  });

  await app.listen(process.env.PORT ?? 3000);
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
      join(__dirname, 'swagger', 'client-server.openapi.json'),
      'utf-8',
    ),
  );
  swaggerDoc.servers = [{ url: '/', description: 'Current server' }];
  injectSwaggerExamples(swaggerDoc);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  expressApp.get('/test-board', (_req, res) => {
    res.sendFile(join(__dirname, 'swagger', 'test-board.html'));
  });

  expressApp.get('/test-board/config', (_req, res) => {
    res.json({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      wechatAppId: process.env.WECHAT_CLIENT_APP_ID || '',
      idvServerUrl: process.env.IDV_BASE_URL || '',
      idvAppUrl: process.env.IDV_APP_URL || '',
    });
  });

  expressApp.get('/wechat/login/callback', async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';

    if (!code) {
      return res.redirect(
        buildWechatLoginErrorRedirectPath('wechat', 'no_code'),
      );
    }

    try {
      const appId = process.env.WECHAT_CLIENT_APP_ID || '';
      const appSecret = process.env.WECHAT_CLIENT_APP_SECRET || '';

      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
      const tokenRes = await fetch(tokenUrl);
      const tokenData = await tokenRes.json();

      if (tokenData.errcode) {
        return res.redirect(
          buildWechatLoginErrorRedirectPath(
            'wechat',
            tokenData.errmsg || 'token_exchange_failed',
          ),
        );
      }

      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}`;
      const userRes = await fetch(userInfoUrl);
      const userData = await userRes.json();

      if (userData.errcode) {
        return res.redirect(
          buildWechatLoginErrorRedirectPath(
            'wechat',
            userData.errmsg || 'userinfo_failed',
          ),
        );
      }

      res.redirect(
        buildWechatLoginSuccessRedirectPath('wechat', {
          unionid: userData.unionid || '',
          openid: userData.openid || '',
          nickname: userData.nickname || '',
          headimgurl: userData.headimgurl || '',
        }),
      );
    } catch (e: any) {
      res.redirect(
        buildWechatLoginErrorRedirectPath(
          'wechat',
          e.message || 'unknown_error',
        ),
      );
    }
  });

  expressApp.get('/wechat-mock/login', (req, res) => {
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const approvePath = buildWechatMockClientLoginCallbackPath(
      '/wechat-mock/login/callback',
      state,
    );
    const denyPath = buildWechatMockClientLoginCallbackPath(
      '/wechat-mock/login/callback',
      state,
      'access_denied',
    );
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderWechatMockClientLoginHtml({ approvePath, denyPath }));
  });

  expressApp.get('/wechat-mock/login/callback', (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const error = typeof req.query.error === 'string' ? req.query.error : '';

    if (error) {
      return res.redirect(
        buildWechatLoginErrorRedirectPath('wechat-mock', error),
      );
    }

    if (!code) {
      return res.redirect(
        buildWechatLoginErrorRedirectPath('wechat-mock', 'no_code'),
      );
    }

    return res.redirect(
      buildWechatLoginSuccessRedirectPath(
        'wechat-mock',
        MOCK_WECHAT_LOGIN_PROFILE,
      ),
    );
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
