import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from 'tomo-idv-client-node';
import type {
  TokenRes,
  StartIdvRes, GetKycRes,
  StartIdvReq,
  GetKycReq,
  SessionStartReq,
  SessionStartRes,
} from 'tomo-idv-client-node';
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
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ── OAuth2 ──

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(): Promise<TokenRes> {
    try { return await this.appService.issueClientCredentialsToken(); }
    catch (e) { return rethrow(e); }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: StartIdvReq): Promise<StartIdvRes> {
    try { return await this.appService.idvStart(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: GetKycReq): Promise<GetKycRes> {
    try { return await this.appService.idvKycGet(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Session (vendor-agnostic) ──

  @Post('/v1/idv/sessions/start')
  async idvSessionStart(@Body() body: SessionStartReq): Promise<SessionStartRes> {
    try { return await this.appService.idvSessionStart(body); }
    catch (e) { return rethrow(e); }
  }

  // ── CN start (이미지 포함 시 verify, 없으면 그대로 전달 → 서버에서 분기) ──

  @Post('/v1/idv/cn/start')
  async idvStartCN(
    @Body() body: { user_id: string; callback_url?: string; card_image_base64?: string; best_frame_base64?: string; kyc_policy_id?: string },
  ): Promise<any> {
    try { return await this.appService.idvStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Per-country start (delegates to generic start with country) ──

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body() body: { user_id: string; callback_url?: string; email?: string; kyc_policy_id?: string },
  ): Promise<StartIdvRes> {
    try { return await this.appService.idvCountryStart(country, body); }
    catch (e) { return rethrow(e); }
  }

  // ── Per-country kyc/get (delegates to unified kyc/get with country) ──

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: { user_id: string },
  ): Promise<GetKycRes> {
    try { return await this.appService.idvCountryKycGet(country, body); }
    catch (e) { return rethrow(e); }
  }

}
