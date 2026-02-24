import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from './sdk/generated/runtime';
import type {
  GetKycUsBody,
  GetKycJpBody,
  IdvUsStartBody,
  IdvJpStartBody,
  IdvStartBody,
  IdvCnStartBody,
  IdvCnTokenBody,
  IdvCnResultBody,
  IdvCnMockStartBody,
  IdvCnMockTokenBody,
  IdvCnMockResultBody,
  GetKycUnionResp,
  TokenResponse,
  PlaidStartIdvResp,
  LiquidIntegratedAppResponse,
  StartIdvResp,
} from './sdk';
import type { TomoIdvStartRes } from './sdk/generated/models/TomoIdvStartRes';
import type { TomoIdvIssueTokenRes } from './sdk/generated/models/TomoIdvIssueTokenRes';
import type { TomoIdvMockStartRes } from './sdk/generated/models/TomoIdvMockStartRes';
import type { TomoIdvMockIssueTokenRes } from './sdk/generated/models/TomoIdvMockIssueTokenRes';

async function rethrow(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    let body: string | undefined;
    try { body = await error.response.text(); } catch {}
    throw new HttpException(
      { statusCode: status, message: body || error.message },
      status,
    );
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

  // ── US (Plaid) ──

  @Post('/v1/idv/us/start')
  async idvStartUS(@Body() body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    try { return await this.appService.idvStartUS(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/us/kyc/get')
  async getKycUS(@Body() body: GetKycUsBody): Promise<GetKycUnionResp> {
    try { return await this.appService.getKycUS(body); }
    catch (e) { return rethrow(e); }
  }

  // ── JP (Liquid) ──

  @Post('/v1/idv/jp/start')
  async idvStartJP(@Body() body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    try { return await this.appService.idvStartJP(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/idv/jp/kyc/get')
  async getKycJP(@Body() body: GetKycJpBody): Promise<GetKycUnionResp> {
    try { return await this.appService.getKycJP(body); }
    catch (e) { return rethrow(e); }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: IdvStartBody): Promise<StartIdvResp> {
    try { return await this.appService.idvStart(body); }
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

  @Post('/v1/idv/cn/result')
  async idvResultCN(@Body() body: IdvCnResultBody): Promise<any> {
    try { return await this.appService.idvResultCN(body); }
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

  @Post('/v1/idv/cn/mock/result')
  async idvMockResultCN(@Body() body: IdvCnMockResultBody): Promise<any> {
    try { return await this.appService.idvMockResultCN(body); }
    catch (e) { return rethrow(e); }
  }
}
