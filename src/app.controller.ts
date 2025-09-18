import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService, IssueAccessTokenResult, TokenResponseBody } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('kyc')
  async getKyc(): Promise<any> {
    return await this.appService.getKyc();
  }
}
