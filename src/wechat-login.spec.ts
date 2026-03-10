import {
  buildWechatLoginErrorRedirectPath,
  buildWechatLoginSuccessRedirectPath,
  buildWechatMockClientLoginCallbackPath,
  MOCK_WECHAT_LOGIN_PROFILE,
  renderWechatMockClientLoginHtml,
} from './wechat-login';

describe('WeChat login helpers', () => {
  // Mock Step 0 must return to /test-board with the same query-param contract
  // as the real WeChat callback so the UI can exercise the same flow without secrets.
  it('builds a success redirect path that preserves provider and WeChat profile fields', () => {
    const path = buildWechatLoginSuccessRedirectPath(
      'wechat-mock',
      MOCK_WECHAT_LOGIN_PROFILE,
    );
    const url = new URL(`http://localhost${path}`);

    expect(url.pathname).toBe('/test-board');
    expect(url.searchParams.get('wechat_login')).toBe('success');
    expect(url.searchParams.get('wechat_provider')).toBe('wechat-mock');
    expect(url.searchParams.get('wechat_unionid')).toBe(
      MOCK_WECHAT_LOGIN_PROFILE.unionid,
    );
    expect(url.searchParams.get('wechat_openid')).toBe(
      MOCK_WECHAT_LOGIN_PROFILE.openid,
    );
  });

  it('builds an error redirect path for provider-specific callback failures', () => {
    const path = buildWechatLoginErrorRedirectPath(
      'wechat-mock',
      'access_denied',
    );
    const url = new URL(`http://localhost${path}`);

    expect(url.pathname).toBe('/test-board');
    expect(url.searchParams.get('wechat_error')).toBe('access_denied');
    expect(url.searchParams.get('wechat_provider')).toBe('wechat-mock');
  });

  it('builds approve and deny callback paths for the mock login page', () => {
    expect(
      buildWechatMockClientLoginCallbackPath(
        '/wechat-mock/login/callback',
        'state-123',
      ),
    ).toBe(
      '/wechat-mock/login/callback?code=mock-wechat-login-code&state=state-123',
    );
    expect(
      buildWechatMockClientLoginCallbackPath(
        '/wechat-mock/login/callback',
        'state-123',
        'access_denied',
      ),
    ).toBe('/wechat-mock/login/callback?error=access_denied&state=state-123');
  });

  // The rendered HTML itself is the mock Step 0 login page, so the test checks
  // that both approval and denial routes are embedded in the page markup.
  it('renders the mock client login page with both approve and deny actions', () => {
    const html = renderWechatMockClientLoginHtml({
      approvePath:
        '/wechat-mock/login/callback?code=mock-wechat-login-code&state=abc',
      denyPath: '/wechat-mock/login/callback?error=access_denied&state=abc',
    });

    expect(html).toContain('MOCK CLIENT LOGIN');
    expect(html).toContain(
      '/wechat-mock/login/callback?code=mock-wechat-login-code&state=abc',
    );
    expect(html).toContain(
      '/wechat-mock/login/callback?error=access_denied&state=abc',
    );
  });
});
