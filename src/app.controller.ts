import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppService, IssueAccessTokenResult, TokenResponseBody } from './app.service';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('access_token')
  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  } 

  @Get('us/start')
  async idvStartUS(@Query('user_id') user_id: string): Promise<any> {
    try {
      return await this.appService.idvStartUS(user_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('us/kyc/get')
  async getKycUS(
    @Query('user_id') user_id: string,
    @Query('fields') fields?: string | string[]
  ): Promise<any> {
    try {
      // fields를 배열로 변환 (없으면 undefined, 문자열이면 배열로 변환)
      const fieldsArray = fields === undefined 
        ? undefined 
        : Array.isArray(fields) 
          ? fields 
          : typeof fields === 'string' && fields.trim() === ''
            ? []
            : fields.split(',').map(f => f.trim()).filter(f => f.length > 0);
      
      return await this.appService.getKycUS(user_id, fieldsArray);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('jp/start')
  async idvStartJP(@Query('user_id') user_id: string): Promise<any> {
    try {
      return await this.appService.idvStartJP(user_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }


  @Get('jp/kyc/get')
  async getKycJP(
    @Query('user_id') user_id: string,
    @Query('fields') fields?: string | string[]
  ): Promise<any> {
    try {
      // fields를 배열로 변환 (없으면 undefined, 문자열이면 배열로 변환)
      const fieldsArray = fields === undefined 
        ? undefined 
        : Array.isArray(fields) 
          ? fields 
          : typeof fields === 'string' && fields.trim() === ''
            ? []
            : fields.split(',').map(f => f.trim()).filter(f => f.length > 0);
      
      return await this.appService.getKycJP(user_id, fieldsArray);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('start')
  async idvStart(@Query('user_id') user_id: string, @Query('callback_url') callback_url: string, @Query('email') email: string, @Query('country') country: string): Promise<any> {
    try {
      return await this.appService.idvStart(user_id, callback_url, email, country);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

}
