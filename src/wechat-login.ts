export type WeChatLoginProvider = 'wechat' | 'wechat-mock';

export interface WeChatLoginProfile {
  unionid: string;
  openid: string;
  nickname: string;
  headimgurl: string;
}

export const MOCK_WECHAT_LOGIN_PROFILE: WeChatLoginProfile = {
  unionid: 'mock-wechat-unionid-12345',
  openid: 'mock-wechat-openid-12345',
  nickname: 'Mock WeChat User',
  headimgurl: '',
};

export function buildWechatLoginSuccessRedirectPath(
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

export function buildWechatLoginErrorRedirectPath(
  provider: WeChatLoginProvider,
  reason: string,
): string {
  const params = new URLSearchParams({
    wechat_error: reason,
    wechat_provider: provider,
  });
  return `/test-board?${params.toString()}`;
}

export function buildWechatMockClientLoginCallbackPath(
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

export function renderWechatMockClientLoginHtml(paths: {
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
    "      <div class='row'><span class='label'>UnionID</span><span class='value'>mock-wechat-unionid-12345</span></div>",
    "      <div class='row'><span class='label'>OpenID</span><span class='value'>mock-wechat-openid-12345</span></div>",
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
