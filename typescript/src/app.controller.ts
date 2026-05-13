import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type {
  TokenRes,
  StartIdvRes,
  GetKycRes,
  StartIdvReq,
  GetKycReq,
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
  async idvResult(@Body() body: GetKycReq): Promise<GetKycRes> {
    try {
      return await this.appService.idvResult(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Deprecated compatibility routes ──

  @Post('/v1/idv/kyc/get')
  async legacyKycGet(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyKycGet(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/us/start')
  async legacyUsStart(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyCountryStart('us', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/uk/start')
  async legacyUkStart(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyCountryStart('uk', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/ca/start')
  async legacyCaStart(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyCountryStart('ca', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/jp/start')
  async legacyJpStart(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyCountryStart('jp', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/cn/start')
  async legacyCnStart(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyCountryStart('cn', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/us/kyc/get')
  async legacyUsKycGet(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyUsKycGet(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/verify/session')
  async legacyVerifySession(@Body() body: unknown): Promise<unknown> {
    try {
      return await this.appService.legacyVerifySession(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
