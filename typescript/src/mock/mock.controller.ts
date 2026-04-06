import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MockService } from './mock.service';
import { ResponseError } from 'tomo-idv-client-node';
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
