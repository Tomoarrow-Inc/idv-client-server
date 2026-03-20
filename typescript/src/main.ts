import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
// ── WeChat Login helpers (inlined from wechat-login.ts) ──

type WeChatLoginProvider = 'wechat' | 'wechat-mock';

interface WeChatLoginProfile {
  unionid: string;
  openid: string;
  nickname: string;
  headimgurl: string;
}

const MOCK_WECHAT_LOGIN_PROFILE: WeChatLoginProfile = {
  unionid: '100000000000012345',
  openid: '200000000000012345',
  nickname: 'Mock WeChat User',
  headimgurl: '',
};

function buildWechatLoginSuccessRedirectPath(
  provider: WeChatLoginProvider,
  profile: WeChatLoginProfile,
): string {
  const params = new URLSearchParams({
    wechat_login: 'success',
    wechat_provider: provider,
    wechat_unionid: profile.unionid,
    wechat_openid: profile.openid,
    wechat_nickname: profile.nickname,
    wechat_headimgurl: profile.headimgurl,
  });
  return `/test-board?${params.toString()}`;
}

function buildWechatLoginErrorRedirectPath(
  provider: WeChatLoginProvider,
  reason: string,
): string {
  const params = new URLSearchParams({
    wechat_error: reason,
    wechat_provider: provider,
  });
  return `/test-board?${params.toString()}`;
}

function buildWechatMockClientLoginCallbackPath(
  basePath: string,
  state?: string,
  error?: string,
): string {
  const params = new URLSearchParams();
  if (error) {
    params.set('error', error);
  } else {
    params.set('code', 'mock-wechat-login-code');
  }
  if (state) {
    params.set('state', state);
  }
  const suffix = params.toString();
  return suffix ? `${basePath}?${suffix}` : basePath;
}

function renderWechatMockClientLoginHtml(paths: {
  approvePath: string;
  denyPath: string;
}): string {
  return [
    '<!DOCTYPE html>',
    "<html lang='en'>",
    '<head>',
    "  <meta charset='utf-8'/>",
    "  <meta name='viewport' content='width=device-width, initial-scale=1'/>",
    '  <title>WeChat Mock Login</title>',
    '  <style>',
    '    * { margin: 0; padding: 0; box-sizing: border-box; }',
    "    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; color: #1f2937; }",
    '    .card { width: 100%; max-width: 420px; background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12); border: 1px solid #e5e7eb; }',
    '    .badge { display: inline-block; background: #ecfccb; color: #3f6212; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }',
    '    h1 { font-size: 24px; margin-bottom: 8px; }',
    '    p { color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }',
    '    .panel { background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 20px; }',
    '    .row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; padding: 6px 0; }',
    '    .label { color: #6b7280; }',
    "    .value { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; color: #111827; text-align: right; }",
    '    .actions { display: flex; gap: 10px; }',
    '    button { flex: 1; border: 0; border-radius: 10px; padding: 14px 16px; font-size: 15px; font-weight: 600; cursor: pointer; }',
    '    .approve { background: #07c160; color: #fff; }',
    '    .deny { background: #e5e7eb; color: #111827; }',
    '  </style>',
    '</head>',
    '<body>',
    "  <div class='card'>",
    "    <span class='badge'>MOCK CLIENT LOGIN</span>",
    '    <h1>WeChat Login</h1>',
    '    <p>This page mirrors the customer-service WeChat login callback flow without requiring a real WeChat App ID or App Secret.</p>',
    "    <div class='panel'>",
    "      <div class='row'><span class='label'>UnionID</span><span class='value'>100000000000012345</span></div>",
    "      <div class='row'><span class='label'>OpenID</span><span class='value'>200000000000012345</span></div>",
    "      <div class='row'><span class='label'>Nickname</span><span class='value'>Mock WeChat User</span></div>",
    '    </div>',
    "    <div class='actions'>",
    `      <button class='approve' onclick="window.location.href='${paths.approvePath}'">Login</button>`,
    `      <button class='deny' onclick="window.location.href='${paths.denyPath}'">Deny</button>`,
    '    </div>',
    '  </div>',
    '</body>',
    '</html>',
  ].join('');
}

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

  // ── JP (Liquid) ──
  setExample('LiquidStartIdvRequest', 'user_id', USER_ID_JP);
  setExample('LiquidStartIdvRequest', 'callback_url', CALLBACK_URL);

  setExample('LiquidGetKycReq', 'user_id', USER_ID_JP);
  // fields: optional, 비워둠

  // ── CN (TomoIdv) ──
  setExample('TomoIdvStartReq', 'user_id', USER_ID_CN);
  setExample('TomoIdvStartReq', 'redirect_url', REDIRECT_URL);

  // ── CN Mock ──
  setExample('TomoIdvMockStartReq', 'user_id', USER_ID_CN);
  setExample('TomoIdvMockStartReq', 'redirect_url', REDIRECT_URL);

  setExample('TomoIdvMockIssueTokenReq', 'user_id', USER_ID_CN);

  setExample('TomoIdvMockGetResultReq', 'user_id', USER_ID_CN);

  // ── Google Social KYC ──
  setExample('GoogleStartReq', 'callback_url', CALLBACK_URL);
  setExample('GoogleStartReq', 'login_hint', '');
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
