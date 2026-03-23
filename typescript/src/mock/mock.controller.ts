import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MockService } from './mock.service';
import { ResponseError } from 'tomo-idv-client-node';
import type { WeChatStartReq, WeChatStartResp } from 'tomo-idv-client-node';
import type { CnMockStartBody, CnMockUserIdBody } from './mock.service';

async function rethrow(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    let body: string | Record<string, any> = '';
    try {
      const text = await error.response.text();
      try { body = JSON.parse(text); } catch { body = text; }
    } catch {
      body = error.message;
    }
    throw new HttpException(body, status);
  }
  const msg = error instanceof Error ? error.message : 'Unknown error';
  throw new HttpException(msg, HttpStatus.BAD_GATEWAY);
}

@Controller()
export class MockController {
  constructor(private readonly mockService: MockService) {}

  // ── WeChat Mock Social KYC ──

  @Post('/v1/idv/social/wechat-mock/start')
  async wechatMockStart(@Body() body: WeChatStartReq): Promise<WeChatStartResp> {
    try { return await this.mockService.wechatMockStart(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/social/wechat-mock/login')
  async wechatMockLogin(@Query('state') state: string, @Res() res: Response) {
    try {
      const html = await this.mockService.wechatMockLoginPage(state);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (e) {
      res.status(502).send('Mock login page proxy error');
    }
  }

  @Get('/v1/idv/social/wechat-mock/callback')
  async wechatMockCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    try {
      const location = await this.mockService.wechatMockCallback(code, state, error);
      res.redirect(302, location);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      res.status(502).send(`Mock callback proxy error: ${msg}`);
    }
  }

  // ── CN Mock ──

  @Post('/v1/idv/cn/mock/start')
  async idvMockStartCN(@Body() body: CnMockStartBody): Promise<any> {
    try { return await this.mockService.idvMockStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/token')
  async idvMockTokenCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try { return await this.mockService.idvMockTokenCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/kyc/get')
  async idvMockKycGetCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try { return await this.mockService.idvMockKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }
}
