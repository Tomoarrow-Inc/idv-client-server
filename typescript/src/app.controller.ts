import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import type {
  TokenRes,
  StartIdvRes,
  StartIdvReq,
  ResultReq,
  ResetReq,
  ResetRes,
  ResultDeleteReq,
  ResultDeleteRes,
  ResultBulkDeleteReq,
  ResultBulkDeleteRes,
} from 'tomo-idv-client-node';
import {
  CONTRACT_VERSION_HEADER,
  rethrowUpstream,
} from './upstream-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ── OAuth2 ──

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(): Promise<TokenRes> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: StartIdvReq): Promise<StartIdvRes> {
    try {
      return await this.appService.idvStart(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // Tomo-API-Version은 idv-server에서 이 endpoint만 해석한다. 값 검증도 서버가
  // 하므로 BFF는 받은 그대로 넘기고, 서버가 적용한 버전을 그대로 되돌려준다.
  @Post('/v1/idv/result')
  async idvResult(
    @Body() body: ResultReq,
    @Headers('tomo-api-version') apiVersion: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    try {
      const { body: payload, version } = await this.appService.idvResult(
        body,
        apiVersion,
      );
      if (version) {
        res.setHeader(CONTRACT_VERSION_HEADER, version);
      }
      return payload;
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/reset')
  @HttpCode(HttpStatus.OK)
  async idvReset(@Body() body: ResetReq): Promise<ResetRes> {
    try {
      return await this.appService.idvReset(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/result/delete')
  @HttpCode(HttpStatus.OK)
  async idvResultDelete(
    @Body() body: ResultDeleteReq,
  ): Promise<ResultDeleteRes> {
    try {
      return await this.appService.idvResultDelete(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/result/bulk-delete')
  @HttpCode(HttpStatus.OK)
  async idvResultBulkDelete(
    @Body() body: ResultBulkDeleteReq,
  ): Promise<ResultBulkDeleteRes> {
    try {
      return await this.appService.idvResultBulkDelete(body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── Deprecated compatibility routes still exposed by idv-server ──

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: Record<string, unknown>): Promise<unknown> {
    try {
      return await this.appService.proxyPost('/v1/idv/kyc/get', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
  ): Promise<unknown> {
    try {
      return await this.appService.proxyPost(`/v1/idv/${country}/start`, body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
  ): Promise<unknown> {
    try {
      return await this.appService.proxyPost(
        `/v1/idv/${country}/kyc/get`,
        body,
      );
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  @Post('/v1/verify/session')
  async verifySession(@Body() body: Record<string, unknown>): Promise<unknown> {
    try {
      return await this.appService.proxyPost('/v1/verify/session', body);
    } catch (e) {
      return rethrowUpstream(e);
    }
  }
}
