import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService, IssueAccessTokenResult } from './app.service';
import type {
  GetKycUsBody,
  GetKycJpBody,
  IdvUsStartBody,
  IdvJpStartBody,
  IdvStartBody,
  GetKycUnionResp,
  PlaidStartIdvResp,
  LiquidIntegratedAppResponse,
  StartIdvResp,
} from './sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('/v1/idv/us/start')
  async idvStartUS(@Body() body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    try {
      return await this.appService.idvStartUS(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('/v1/idv/us/kyc/get')
  async getKycUS(@Body() body: GetKycUsBody): Promise<GetKycUnionResp> {
    try {
      return await this.appService.getKycUS(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('/v1/idv/jp/start')
  async idvStartJP(@Body() body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    try {
      return await this.appService.idvStartJP(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('/v1/idv/jp/kyc/get')
  async getKycJP(@Body() body: GetKycJpBody): Promise<GetKycUnionResp> {
    try {
      return await this.appService.getKycJP(body);
    } catch (error: any) {
      if (error?.response && typeof error.response.text === 'function') {
        const bodyText = await error.response.text();
        const status = error.response.status || HttpStatus.BAD_GATEWAY;
        throw new HttpException(
          { message: bodyText || error.message, statusCode: status },
          status,
        );
      }
      throw new HttpException(error?.message ?? 'Unknown error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('/v1/idv/start')
  async idvStart(@Body() body: IdvStartBody): Promise<StartIdvResp> {
    try {
      return await this.appService.idvStart(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
