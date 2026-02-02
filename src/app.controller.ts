import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService, IssueAccessTokenResult } from './app.service';
import { contract } from './contract/api';
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

  @Post(contract.access_token.path)
  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_us_start.path)
  async idvStartUS(@Body() body: IdvUsStartBody): Promise<PlaidStartIdvResp> {
    try {
      return await this.appService.idvStartUS(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_us_get_result.path)
  async getKycUS(@Body() body: GetKycUsBody): Promise<GetKycUnionResp> {
    try {
      return await this.appService.getKycUS(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_jp_start.path)
  async idvStartJP(@Body() body: IdvJpStartBody): Promise<LiquidIntegratedAppResponse> {
    try {
      return await this.appService.idvStartJP(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_jp_get_result.path)
  async getKycJP(@Body() body: GetKycJpBody): Promise<GetKycUnionResp> {
    try {
      return await this.appService.getKycJP(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_start.path)
  async idvStart(@Body() body: IdvStartBody): Promise<StartIdvResp> {
    try {
      return await this.appService.idvStart(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
