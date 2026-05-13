import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type {
  TokenRes,
  StartIdvRes,
  ResultRes,
  StartIdvReq,
  ResultReq,
} from 'tomo-idv-client-node';
import { rethrowUpstream } from './upstream-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ── OAuth2 ──

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(): Promise<TokenRes> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: StartIdvReq): Promise<StartIdvRes> {
    try {
      return await this.appService.idvStart(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/result')
  async idvResult(@Body() body: ResultReq): Promise<ResultRes> {
    try {
      return await this.appService.idvResult(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
