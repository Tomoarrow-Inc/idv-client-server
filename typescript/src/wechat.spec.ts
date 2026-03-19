import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdvServerClient } from './sdk/idv-client';
import { StateService } from './state.service';
import type { WeChatStartBody, WeChatStartResp } from './sdk';

describe('WeChat Social eKYC', () => {
  let controller: AppController;
  let service: AppService;
  let idvClient: jest.Mocked<IdvServerClient>;
  let stateService: jest.Mocked<StateService>;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    const mockIdvClient = {
      wechatStart: jest.fn(),
      wechatMockStart: jest.fn(),
    };

    const mockStateService = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      clear: jest.fn(),
      size: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      push: jest.fn(),
      remove: jest.fn(),
      setProperty: jest.fn(),
      removeProperty: jest.fn(),
      subscribe: jest.fn(),
      getKeys: jest.fn(),
      setMultiple: jest.fn(),
      getMultiple: jest.fn(),
      backup: jest.fn(),
      restore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: IdvServerClient, useValue: mockIdvClient },
        { provide: StateService, useValue: mockStateService },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
    idvClient = module.get(IdvServerClient);
    stateService = module.get(StateService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
    delete process.env.IDV_BASE_URL;
  });

  // ── AppController POST /v1/idv/wechat/start ──

  describe('AppController wechatStart', () => {
    it('should return authorization_url on success', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
        country: 'cn',
      };
      const expected: WeChatStartResp = {
        authorization_url:
          'https://open.weixin.qq.com/connect/qrconnect?appid=wxtest',
      };

      stateService.get.mockReturnValue('mock-access-token');
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
    });

    it('should throw HttpException when no access token', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
      };
      stateService.get.mockReturnValue(undefined);

      await expect(controller.wechatStart(body)).rejects.toThrow(HttpException);
    });

    it('should preserve error message about missing token', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
      };
      stateService.get.mockReturnValue(undefined);

      try {
        await controller.wechatStart(body);
        fail('Expected HttpException');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getResponse()).toContain(
          'No access token found',
        );
      }
    });
  });

  // ── AppService wechatStart ──

  describe('AppService wechatStart', () => {
    it('should delegate to idvServerClient.wechatStart with access token', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
        country: 'cn',
      };
      const expected: WeChatStartResp = {
        authorization_url: 'https://open.weixin.qq.com/connect/qrconnect',
      };

      stateService.get.mockReturnValue('test-token-123');
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await service.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith(
        'test-token-123',
        body,
      );
    });

    it('should throw Error when access token is missing', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
      };
      stateService.get.mockReturnValue(undefined);

      await expect(service.wechatStart(body)).rejects.toThrow(
        'No access token found. Please call /v1/oauth2/token first.',
      );
    });

    it('should pass access token from stateService as first argument', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
      };
      const expected: WeChatStartResp = {
        authorization_url: 'https://example.com/wechat',
      };

      stateService.get.mockReturnValue('bearer-token-xyz');
      idvClient.wechatStart.mockResolvedValue(expected);

      await service.wechatStart(body);
      expect(idvClient.wechatStart).toHaveBeenCalledWith(
        'bearer-token-xyz',
        body,
      );
      expect(stateService.get).toHaveBeenCalledWith('access_token');
    });
  });

  describe('AppService wechatMockStart', () => {
    it('rewrites idv-server mock authorization_url to a browser-safe relative path', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
        country: 'us',
        login_hint: 'user@example.com',
      };
      const expected: WeChatStartResp = {
        authorization_url:
          'http://idv-server-ghci/v1/idv/social/wechat-mock/login?state=mock-state',
      };

      stateService.get.mockReturnValue('mock-token');
      idvClient.wechatMockStart.mockResolvedValue(expected);

      const result = await service.wechatMockStart(body);

      expect(result).toEqual({
        authorization_url: '/v1/idv/social/wechat-mock/login?state=mock-state',
      });
      expect(idvClient.wechatMockStart).toHaveBeenCalledWith(
        'mock-token',
        body,
      );
    });
  });

  describe('AppService wechatMock proxy helpers', () => {
    it('rewrites callback URLs inside the proxied mock consent page', async () => {
      process.env.IDV_BASE_URL = 'http://idv-server-ghci';
      global.fetch = jest.fn().mockResolvedValue({
        text: jest
          .fn()
          .mockResolvedValue(
            '<button onclick="window.location.href=\'http://idv-server-ghci/v1/idv/social/wechat-mock/callback?code=mock-code&state=abc\'"></button>',
          ),
      } as any);

      const html = await service.wechatMockLoginPage('abc');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://idv-server-ghci/v1/idv/social/wechat-mock/login?state=abc',
      );
      expect(html).toContain(
        "window.location.href='/v1/idv/social/wechat-mock/callback?code=mock-code&state=abc'",
      );
    });

    it('returns the redirect location from the mock callback proxy', async () => {
      process.env.IDV_BASE_URL = 'http://idv-server-ghci';
      global.fetch = jest.fn().mockResolvedValue({
        headers: {
          get: jest.fn().mockReturnValue('/test-board?code=approved'),
        },
      } as any);

      const location = await service.wechatMockCallback(
        'mock-code',
        'mock-state',
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'http://idv-server-ghci/v1/idv/social/wechat-mock/callback?code=mock-code&state=mock-state',
        { redirect: 'manual' },
      );
      expect(location).toBe('/test-board?code=approved');
    });
  });

  // ── WeChatStartBody type validation ──

  describe('WeChatStartBody variants', () => {
    beforeEach(() => {
      stateService.get.mockReturnValue('token');
    });

    // login_hint is forwarded as-is so customer services can pass a Plaid email fallback
    // while keeping the same public request shape as the Google social start flow.
    it('accepts body with login_hint field', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
        country: 'us',
        login_hint: 'user@example.com',
      };
      const expected: WeChatStartResp = {
        authorization_url: 'https://open.weixin.qq.com/...',
      };
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('token', body);
    });

    it('accepts minimal body with callback_url only', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
      };
      const expected: WeChatStartResp = {
        authorization_url: 'https://open.weixin.qq.com/...',
      };
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('token', body);
    });

    it('accepts body with country field', async () => {
      const body: WeChatStartBody = {
        callback_url: 'https://example.com/callback',
        country: 'cn',
      };
      const expected: WeChatStartResp = {
        authorization_url: 'https://open.weixin.qq.com/...',
      };
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('token', body);
    });
  });
});
