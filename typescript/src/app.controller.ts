import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import type {
  TokenRes,
  StartIdvRes,
  ResultRes,
  StartIdvReq,
  ResultReq,
  ResetReq,
  ResetRes,
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

  @Post('/v1/idv/reset')
  @HttpCode(HttpStatus.OK)
  async idvReset(@Body() body: ResetReq): Promise<ResetRes> {
    try {
      return await this.appService.idvReset(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Deprecated compatibility routes still exposed by idv-server ──

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: Record<string, unknown>): Promise<unknown> {
    try {
      return await this.appService.proxyPost('/v1/idv/kyc/get', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
  ): Promise<unknown> {
    try {
      return await this.appService.proxyPost(`/v1/idv/${country}/start`, body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
  ): Promise<unknown> {
    try {
      return await this.appService.proxyPost(
        `/v1/idv/${country}/kyc/get`,
        body,
      );
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/verify/session')
  async verifySession(@Body() body: Record<string, unknown>): Promise<unknown> {
    try {
      return await this.appService.proxyPost('/v1/verify/session', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
