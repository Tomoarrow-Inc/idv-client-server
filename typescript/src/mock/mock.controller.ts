import { Body, Controller, Post } from '@nestjs/common';
import { MockService } from './mock.service';
import type { CnMockStartBody, CnMockUserIdBody } from './mock.service';
import { rethrowUpstream } from '../upstream-response';

@Controller()
export class MockController {
  constructor(private readonly mockService: MockService) {}

  // ── CN Mock ──

  @Post('/v1/idv/cn/mock/start')
  async idvMockStartCN(@Body() body: CnMockStartBody): Promise<any> {
    try {
      return await this.mockService.idvMockStartCN(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/cn/mock/token')
  async idvMockTokenCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try {
      return await this.mockService.idvMockTokenCN(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/cn/mock/kyc/get')
  async idvMockKycGetCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try {
      return await this.mockService.idvMockKycGetCN(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
