import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type {
  TokenRes,
  StartIdvRes,
  GetKycRes,
  StartIdvReq,
  GetKycReq,
  SessionStartReq,
  SessionStartRes,
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

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: GetKycReq): Promise<GetKycRes> {
    try {
      return await this.appService.idvKycGet(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Session (vendor-agnostic) ──

  @Post('/v1/idv/sessions/start')
  async idvSessionStart(
    @Body() body: SessionStartReq,
  ): Promise<SessionStartRes> {
    try {
      return await this.appService.idvSessionStart(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── CN start (이미지 포함 시 verify, 없으면 그대로 전달 → 서버에서 분기) ──

  @Post('/v1/idv/cn/start')
  async idvStartCN(
    @Body()
    body: {
      user_id: string;
      callback_url?: string;
      card_image_base64?: string;
      best_frame_base64?: string;
      kyc_policy_id?: string;
    },
  ): Promise<any> {
    try {
      return await this.appService.idvStartCN(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Per-country start (delegates to generic start with country) ──

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body()
    body: {
      user_id: string;
      callback_url?: string;
      email?: string;
      kyc_policy_id?: string;
    },
  ): Promise<unknown> {
    try {
      return await this.appService.idvCountryStart(country, body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Per-country kyc/get (delegates to unified kyc/get with country) ──

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: { user_id: string },
  ): Promise<unknown> {
    try {
      return await this.appService.idvCountryKycGet(country, body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
