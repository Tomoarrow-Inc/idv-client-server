import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from 'tomo-idv-client-node';
import type {
  TokenResponse, PlaidStartIdvResp, LiquidIntegratedAppResponse,
  StartIdvResp, GetKycResp,
  TomoIdvStartRes,
  LiquidGetUnionResultResp, TencentGetUnionResultResp,
  StartIdvReq,
  GetKycReq,
  PlaidStartIdvRequest,
  PlaidGetKycReq,
  LiquidStartIdvRequest,
  LiquidGetKycReq,
  TomoIdvStartReq,
  TencentGetKycReq,
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
  async getKycJP(@Body() body: LiquidGetKycReq): Promise<LiquidGetUnionResultResp> {
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
  async idvKycGetCN(@Body() body: TencentGetKycReq): Promise<TencentGetUnionResultResp> {
    try { return await this.appService.idvKycGetCN(body); }
    catch (e) { return rethrow(e); }
  }

  @Get('/v1/idv/cn/health')
  async healthCN(): Promise<string> {
    try { return await this.appService.healthCN(); }
    catch (e) { return rethrow(e); }
  }

}
