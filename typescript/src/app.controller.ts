import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import type { UpstreamResponse } from './app.service';
import type {
  StartIdvReq,
  ResultReq,
  ResetReq,
  ResultDeleteReq,
  ResultBulkDeleteReq,
} from 'tomo-idv-client-node';
import {
  CONTRACT_VARY_TOKEN,
  CONTRACT_VERSION_HEADER,
  resolveContractSelection,
} from './contract-version';
import { rethrowUpstream } from './upstream-response';

type InboundHeaders = Record<string, string | string[] | undefined>;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * idv-server 는 25개 SDK operation 전부에서 Tomo-API-Version 을 해석한다.
   * 모든 라우트가 같은 규칙을 쓰도록 선택 해석과 응답 header 에코를 한 곳에
   * 모았다. 값 검증은 서버 몫이라 BFF 는 거르지 않는다.
   */
  private async forward<T>(
    res: Response,
    headers: InboundHeaders,
    call: (
      selection: ReturnType<typeof resolveContractSelection>,
    ) => Promise<UpstreamResponse<T>>,
  ): Promise<T> {
    try {
      const { body, status, version, varies } = await call(
        resolveContractSelection(headers),
      );
      // Nest 의 POST 기본 status 는 201 이다. upstream 이 낸 status 를 그대로
      // 돌려주지 않으면 idv-server 의 200 이 201 로 바뀐다.
      res.status(status);
      if (version) {
        res.setHeader(CONTRACT_VERSION_HEADER, version);
      }
      // setHeader 가 아니라 vary() 를 쓴다. 기존 Vary 토큰을 덮어쓰지 않는다.
      if (varies) {
        res.vary(CONTRACT_VARY_TOKEN);
      }
      return body;
    } catch (e) {
      return rethrowUpstream(e);
    }
  }

  // ── OAuth2 ──

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.issueClientCredentialsToken(selection),
    );
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(
    @Body() body: StartIdvReq,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.idvStart(body, selection),
    );
  }

  @Post('/v1/idv/result')
  async idvResult(
    @Body() body: ResultReq,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.idvResult(body, selection),
    );
  }

  @Post('/v1/idv/reset')
  async idvReset(
    @Body() body: ResetReq,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.idvReset(body, selection),
    );
  }

  @Post('/v1/idv/result/delete')
  async idvResultDelete(
    @Body() body: ResultDeleteReq,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.idvResultDelete(body, selection),
    );
  }

  @Post('/v1/idv/result/bulk-delete')
  async idvResultBulkDelete(
    @Body() body: ResultBulkDeleteReq,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.idvResultBulkDelete(body, selection),
    );
  }

  // ── Deprecated compatibility routes still exposed by idv-server ──

  @Post('/v1/idv/kyc/get')
  async idvKycGet(
    @Body() body: Record<string, unknown>,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.proxyPost('/v1/idv/kyc/get', body, selection),
    );
  }

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.proxyPost(`/v1/idv/${country}/start`, body, selection),
    );
  }

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.proxyPost(`/v1/idv/${country}/kyc/get`, body, selection),
    );
  }

  // /v1/verify/session 은 idv-server 의 25개 SDK operation 에 없다. 게이트를
  // 거치지 않으므로 버전 header 는 무시되지만, 규칙을 라우트마다 갈라놓지
  // 않기 위해 같은 경로로 전달한다.
  @Post('/v1/verify/session')
  async verifySession(
    @Body() body: Record<string, unknown>,
    @Headers() headers: InboundHeaders,
    @Res({ passthrough: true }) res: Response,
  ): Promise<unknown> {
    return this.forward(res, headers, (selection) =>
      this.appService.proxyPost('/v1/verify/session', body, selection),
    );
  }
}
