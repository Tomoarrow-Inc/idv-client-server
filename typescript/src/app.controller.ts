import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import { ResponseError } from 'tomo-idv-client-node';
import type {
  TokenResponse, GoogleStartResp, PlaidStartIdvResp, LiquidIntegratedAppResponse,
  StartIdvResp, GetKycResp,
  TomoIdvStartRes,
  // Request body types (replacing api-contract.ts)
  StartIdvReq,
  GetKycReq,
  PlaidStartIdvRequest,
  PlaidGetKycReq,
  LiquidStartIdvRequest,
  LiquidGetKycReq,
  TomoIdvStartReq,
  TencentGetKycReq,
  GoogleStartReq,
  WeChatStartReq,
  WeChatStartResp,
  SocialResultReq,
} from 'tomo-idv-client-node';

/** CN mock endpoint request types (not in SDK — mock endpoints use raw apiPost) */
type CnMockStartBody = { user_id: string; redirect_url: string };
type CnMockUserIdBody = { user_id: string };
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
  async issueClientCredentialsToken(): Promise<TokenResponse> {
    try { return await this.appService.issueClientCredentialsToken(); }
    catch (e) { return rethrow(e); }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: StartIdvReq): Promise<StartIdvResp> {
    try { return await this.appService.idvStart(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: GetKycReq): Promise<GetKycResp> {
    try { return await this.appService.idvKycGet(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Google Social KYC ──

  @Post('/v1/idv/social/google/start')
  async googleStart(@Body() body: GoogleStartReq): Promise<GoogleStartResp> {
    try { return await this.appService.googleStart(body); }
    catch (e) { return rethrow(e); }
  }

  // ── WeChat Social KYC ──

  @Post('/v1/idv/social/wechat/start')
  async wechatStart(@Body() body: WeChatStartReq): Promise<WeChatStartResp> {
    try { return await this.appService.wechatStart(body); }
    catch (e) { return rethrow(e); }
  }

  // ── WeChat Mock Social KYC ──

  @Post('/v1/idv/social/wechat-mock/start')
  async wechatMockStart(@Body() body: WeChatStartReq): Promise<WeChatStartResp> {
    try { return await this.appService.wechatMockStart(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/social/wechat-mock/login')
  async wechatMockLogin(@Query('state') state: string, @Res() res: Response) {
    try {
      const html = await this.appService.wechatMockLoginPage(state);
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
      const location = await this.appService.wechatMockCallback(code, state, error);
      res.redirect(302, location);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      res.status(502).send(`Mock callback proxy error: ${msg}`);
    }
  }

  // ── Social Result ──

  @Post('/v1/idv/social/result')
  async socialResult(@Body() body: SocialResultReq): Promise<GetKycResp> {
    try { return await this.appService.socialResult(body); }
    catch (e) { return rethrow(e); }
  }

  // ── US (Plaid) ──

  @Post('/v1/idv/us/start')
  async idvStartUS(@Body() body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/us/kyc/get')
  async getKycUS(@Body() body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/us/health')
  async healthUS(): Promise<string> {
    try { return await this.appService.healthUS(); }
    catch (e) { return rethrow(e); }
  }

  // ── UK (Plaid) ──

  @Post('/v1/idv/uk/start')
  async idvStartUK(@Body() body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/uk/kyc/get')
  async getKycUK(@Body() body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/uk/health')
  async healthUK(): Promise<string> {
    try { return await this.appService.healthUK(); }
    catch (e) { return rethrow(e); }
  }

  // ── CA (Plaid) ──

  @Post('/v1/idv/ca/start')
  async idvStartCA(@Body() body: PlaidStartIdvRequest): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/ca/kyc/get')
  async getKycCA(@Body() body: PlaidGetKycReq): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/ca/health')
  async healthCA(): Promise<string> {
    try { return await this.appService.healthCA(); }
    catch (e) { return rethrow(e); }
  }

  // ── JP (Liquid) ──

  @Post('/v1/idv/jp/start')
  async idvStartJP(@Body() body: LiquidStartIdvRequest): Promise<LiquidIntegratedAppResponse> {
    try { return await this.appService.idvStartJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/kyc/get')
  async getKycJP(@Body() body: LiquidGetKycReq): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/jp/health')
  async healthJP(): Promise<string> {
    try { return await this.appService.healthJP(); }
    catch (e) { return rethrow(e); }
  }

  // ── CN (TomoIdv) ──

  @Post('/v1/idv/cn/start')
  async idvStartCN(@Body() body: TomoIdvStartReq): Promise<TomoIdvStartRes> {
    try { return await this.appService.idvStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/kyc/get')
  async idvKycGetCN(@Body() body: TencentGetKycReq): Promise<any> {
    try { return await this.appService.idvKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/cn/health')
  async healthCN(): Promise<string> {
    try { return await this.appService.healthCN(); }
    catch (e) { return rethrow(e); }
  }

  // ── CN Mock ──

  @Post('/v1/idv/cn/mock/start')
  async idvMockStartCN(@Body() body: CnMockStartBody): Promise<any> {
    try { return await this.appService.idvMockStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/token')
  async idvMockTokenCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try { return await this.appService.idvMockTokenCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/kyc/get')
  async idvMockKycGetCN(@Body() body: CnMockUserIdBody): Promise<any> {
    try { return await this.appService.idvMockKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }

}
