import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService, IssueAccessTokenResult, TokenResponseBody } from './app.service';
import { contract } from './contract/api';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('access_token')
  // async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
  //   try {
  //     return await this.appService.issueClientCredentialsToken();
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
  //   }
  // } 

  @Post(contract.access_token.path)
  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  } 

  @Post(contract.idv_us_start.path)
  async idvStartUS(@Body() body: any): Promise<any> {
    try {
      return await this.appService.idvStartUS(body?.user_id, body?.email, body?.callback_url);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_us_get_result.path)
  async getKycUS(@Body() body: any): Promise<any> {
    try {
      return await this.appService.getKycUS(body?.user_id, body?.fields);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_jp_start.path)
  async idvStartJP(@Body() body: any): Promise<any> {
    try {
      return await this.appService.idvStartJP(body?.user_id, body?.callback_url);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }


  @Post(contract.idv_jp_get_result.path)
  async getKycJP(@Body() body: any): Promise<any> {
    try {
      return await this.appService.getKycJP(body?.user_id, body?.fields);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post(contract.idv_start.path)
  async idvStart(@Body() body: any): Promise<any> {
    try {
      return await this.appService.idvStart(body?.user_id, body?.callback_url, body?.email, body?.country);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

}
