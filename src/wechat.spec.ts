import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdvServerClient } from './idvServer/idvServerClient';
import { StateService } from './state.service';
import type { WeChatStartBody, WeChatStartResp } from './sdk';

describe('WeChat Social eKYC', () => {
  let controller: AppController;
  let service: AppService;
  let idvClient: jest.Mocked<IdvServerClient>;
  let stateService: jest.Mocked<StateService>;

  beforeEach(async () => {
    const mockIdvClient = {
      wechatStart: jest.fn(),
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

  // ── AppController POST /v1/idv/wechat/start ──

  describe('AppController wechatStart', () => {
    it('should return authorization_url on success', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback', country: 'cn' };
      const expected: WeChatStartResp = { authorization_url: 'https://open.weixin.qq.com/connect/qrconnect?appid=wxtest' };

      stateService.get.mockReturnValue('mock-access-token');
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
    });

    it('should throw HttpException when no access token', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback' };
      stateService.get.mockReturnValue(undefined);

      await expect(controller.wechatStart(body)).rejects.toThrow(HttpException);
    });

    it('should preserve error message about missing token', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback' };
      stateService.get.mockReturnValue(undefined);

      try {
        await controller.wechatStart(body);
        fail('Expected HttpException');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getResponse()).toContain('No access token found');
      }
    });
  });

  // ── AppService wechatStart ──

  describe('AppService wechatStart', () => {
    it('should delegate to idvServerClient.wechatStart with access token', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback', country: 'cn' };
      const expected: WeChatStartResp = { authorization_url: 'https://open.weixin.qq.com/connect/qrconnect' };

      stateService.get.mockReturnValue('test-token-123');
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await service.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('test-token-123', body);
    });

    it('should throw Error when access token is missing', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback' };
      stateService.get.mockReturnValue(undefined);

      await expect(service.wechatStart(body)).rejects.toThrow(
        'No access token found. Please call /v1/oauth2/token first.',
      );
    });

    it('should pass access token from stateService as first argument', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback' };
      const expected: WeChatStartResp = { authorization_url: 'https://example.com/wechat' };

      stateService.get.mockReturnValue('bearer-token-xyz');
      idvClient.wechatStart.mockResolvedValue(expected);

      await service.wechatStart(body);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('bearer-token-xyz', body);
      expect(stateService.get).toHaveBeenCalledWith('access_token');
    });
  });

  // ── WeChatStartBody type validation ──

  describe('WeChatStartBody variants', () => {
    beforeEach(() => {
      stateService.get.mockReturnValue('token');
    });

    it('accepts minimal body with callback_url only', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback' };
      const expected: WeChatStartResp = { authorization_url: 'https://open.weixin.qq.com/...' };
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('token', body);
    });

    it('accepts body with country field', async () => {
      const body: WeChatStartBody = { callback_url: 'https://example.com/callback', country: 'cn' };
      const expected: WeChatStartResp = { authorization_url: 'https://open.weixin.qq.com/...' };
      idvClient.wechatStart.mockResolvedValue(expected);

      const result = await controller.wechatStart(body);
      expect(result).toEqual(expected);
      expect(idvClient.wechatStart).toHaveBeenCalledWith('token', body);
    });
  });
});
