import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from './sdk/generated/runtime';
import type {
  // Generic
  IdvStartBody,
  IdvKycGetBody,
  // US
  IdvUsStartBody,
  GetKycUsBody,
  PutKycUsBody,
  IdvUsCookieStartBody,
  PlaidSessionTokenBody,
  // UK
  IdvUkStartBody,
  GetKycUkBody,
  PutKycUkBody,
  IdvUkCookieStartBody,
  // CA
  IdvCaStartBody,
  GetKycCaBody,
  PutKycCaBody,
  IdvCaCookieStartBody,
  // JP
  IdvJpStartBody,
  GetKycJpBody,
  PutKycJpBody,
  IdvJpCookieStartBody,
  LiquidSessionTokenBody,
  // CN
  IdvCnStartBody,
  IdvCnTokenBody,
  IdvCnKycGetBody,
  IdvCnMockStartBody,
  IdvCnMockTokenBody,
  IdvCnMockKycGetBody,
  // Login Ticket
  LoginTicketBody,
  TokenResponse,
  // Google Social KYC
  GoogleStartBody,
  // WeChat Social KYC
  WeChatStartBody,
  WeChatStartResp,
} from './sdk';
import type { GoogleStartResp } from './sdk/generated/models/GoogleStartResp';
import type { PlaidStartIdvResp } from './sdk/generated/models/PlaidStartIdvResp';
import type { LiquidIntegratedAppResponse } from './sdk/generated/models/LiquidIntegratedAppResponse';
import type { StartIdvResp } from './sdk/generated/models/StartIdvResp';
import type { GetKycResp } from './sdk/generated/models/GetKycResp';
import type { SessionToken } from './sdk/generated/models/SessionToken';
import type { LoginTicketResponse } from './sdk/generated/models/LoginTicketResponse';
import type { EitherStringValue } from './sdk/generated/models/EitherStringValue';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';

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
  async idvStart(@Body() body: IdvStartBody): Promise<StartIdvResp> {
    try { return await this.appService.idvStart(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: IdvKycGetBody): Promise<GetKycResp> {
    try { return await this.appService.idvKycGet(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Google Social KYC ──

  @Post('/v1/idv/google/start')
  async googleStart(@Body() body: GoogleStartBody): Promise<GoogleStartResp> {
    try { return await this.appService.googleStart(body); }
    catch (e) { return rethrow(e); }
  }

  // ── WeChat Social KYC ──

  @Post('/v1/idv/wechat/start')
  async wechatStart(@Body() body: WeChatStartBody): Promise<WeChatStartResp> {
    try { return await this.appService.wechatStart(body); }
    catch (e) { return rethrow(e); }
  }

  // ── US (Plaid) ──

  @Post('/v1/idv/us/start')
  async idvStartUS(@Body() body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/us/kyc/get')
  async getKycUS(@Body() body: GetKycUsBody): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/us/kyc/put')
  async putKycUS(@Body() body: PutKycUsBody): Promise<void> {
    try { return await this.appService.putKycUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/us/cookie/start')
  async idvCookieStartUS(@Body() body: IdvUsCookieStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvCookieStartUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/us/health')
  async healthUS(): Promise<string> {
    try { return await this.appService.healthUS(); }
    catch (e) { return rethrow(e); }
  }

  // ── UK (Plaid) ──

  @Post('/v1/idv/uk/start')
  async idvStartUK(@Body() body: IdvUkStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/uk/kyc/get')
  async getKycUK(@Body() body: GetKycUkBody): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/uk/kyc/put')
  async putKycUK(@Body() body: PutKycUkBody): Promise<void> {
    try { return await this.appService.putKycUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/uk/cookie/start')
  async idvCookieStartUK(@Body() body: IdvUkCookieStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvCookieStartUK(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/uk/health')
  async healthUK(): Promise<string> {
    try { return await this.appService.healthUK(); }
    catch (e) { return rethrow(e); }
  }

  // ── CA (Plaid) ──

  @Post('/v1/idv/ca/start')
  async idvStartCA(@Body() body: IdvCaStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/ca/kyc/get')
  async getKycCA(@Body() body: GetKycCaBody): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/ca/kyc/put')
  async putKycCA(@Body() body: PutKycCaBody): Promise<void> {
    try { return await this.appService.putKycCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/ca/cookie/start')
  async idvCookieStartCA(@Body() body: IdvCaCookieStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvCookieStartCA(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/ca/health')
  async healthCA(): Promise<string> {
    try { return await this.appService.healthCA(); }
    catch (e) { return rethrow(e); }
  }

  // ── JP (Liquid) ──

  @Post('/v1/idv/jp/start')
  async idvStartJP(@Body() body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    try { return await this.appService.idvStartJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/kyc/get')
  async getKycJP(@Body() body: GetKycJpBody): Promise<{ [key: string]: string }> {
    try { return await this.appService.getKycJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/kyc/put')
  async putKycJP(@Body() body: PutKycJpBody): Promise<void> {
    try { return await this.appService.putKycJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/cookie/start')
  async idvCookieStartJP(@Body() body: IdvJpCookieStartBody): Promise<LiquidIntegratedAppResponse> {
    try { return await this.appService.idvCookieStartJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/notification')
  async notificationJP(@Body() body: any): Promise<EitherStringValue> {
    try { return await this.appService.notificationJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/jp/health')
  async healthJP(): Promise<string> {
    try { return await this.appService.healthJP(); }
    catch (e) { return rethrow(e); }
  }

  // ── CN (TomoIdv) ──

  @Post('/v1/idv/cn/start')
  async idvStartCN(@Body() body: IdvCnStartBody): Promise<TomoIdvStartRes> {
    try { return await this.appService.idvStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/token')
  async idvTokenCN(@Body() body: IdvCnTokenBody): Promise<TomoIdvIssueTokenRes> {
    try { return await this.appService.idvTokenCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/kyc/get')
  async idvKycGetCN(@Body() body: IdvCnKycGetBody): Promise<any> {
    try { return await this.appService.idvKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/result/web')
  async idvResultWebCN(): Promise<any> {
    try { return await this.appService.idvResultWebCN(); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/cn/health')
  async healthCN(): Promise<string> {
    try { return await this.appService.healthCN(); }
    catch (e) { return rethrow(e); }
  }

  // ── CN Mock ──

  @Post('/v1/idv/cn/mock/start')
  async idvMockStartCN(@Body() body: IdvCnMockStartBody): Promise<TomoIdvMockStartRes> {
    try { return await this.appService.idvMockStartCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/token')
  async idvMockTokenCN(@Body() body: IdvCnMockTokenBody): Promise<TomoIdvMockIssueTokenRes> {
    try { return await this.appService.idvMockTokenCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/cn/mock/kyc/get')
  async idvMockKycGetCN(@Body() body: IdvCnMockKycGetBody): Promise<any> {
    try { return await this.appService.idvMockKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Session Tokens ──

  @Post('/v1/idv/plaid/token/session')
  async plaidTokenSession(@Body() body: PlaidSessionTokenBody): Promise<SessionToken> {
    try { return await this.appService.plaidTokenSession(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/liquid/token/session')
  async liquidTokenSession(@Body() body: LiquidSessionTokenBody): Promise<SessionToken> {
    try { return await this.appService.liquidTokenSession(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Login Ticket ──

  @Post('/v1/idv/login-ticket')
  async loginTicket(@Body() body: LoginTicketBody): Promise<LoginTicketResponse> {
    try { return await this.appService.loginTicket(body); }
    catch (e) { return rethrow(e); }
  }
}
