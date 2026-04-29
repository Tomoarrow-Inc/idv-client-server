import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from 'tomo-idv-client-node';
import type {
  TokenRes,
  StartIdvRes,
  GetKycRes,
  StartIdvReq,
  GetKycReq,
  SessionStartReq,
  SessionStartRes,
} from 'tomo-idv-client-node';

export const EMPTY_KYC_POLICY_ID_MESSAGE = 'Please provide kyc_policy_id.';
const LEGACY_EMPTY_KYC_POLICY_ID_MESSAGE =
  'kyc_policy_id \uAC12\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.';

export function normalizeUpstreamErrorBody(
  body: string | Record<string, unknown>,
): string | Record<string, unknown> {
  if (typeof body === 'string') {
    return normalizeUpstreamErrorMessage(body);
  }
  if (typeof body.message === 'string') {
    return { ...body, message: normalizeUpstreamErrorMessage(body.message) };
  }
  return body;
}

function normalizeUpstreamErrorMessage(message: string): string {
  return message.replace(
    LEGACY_EMPTY_KYC_POLICY_ID_MESSAGE,
    EMPTY_KYC_POLICY_ID_MESSAGE,
  );
}

function parseUpstreamErrorText(
  text: string,
): string | Record<string, unknown> {
  try {
    const parsed = JSON.parse(text) as unknown;
    return parsed !== null && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : text;
  } catch {
    return text;
  }
}

// Problem: upstream Korean kyc_policy_id validation text was forwarded as a
// NestJS { statusCode, message } response. Improved function: rethrow.
export async function rethrowOld(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    let body: string | Record<string, unknown> = '';
    try {
      const text = await error.response.text();
      body = parseUpstreamErrorText(text);
    } catch {
      body = error.message;
    }
    throw new HttpException(body, status);
  }
  const msg = error instanceof Error ? error.message : 'Unknown error';
  throw new HttpException(msg, HttpStatus.BAD_GATEWAY);
}

async function rethrow(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    let body: string | Record<string, unknown> = '';
    try {
      const text = await error.response.text();
      body = parseUpstreamErrorText(text);
    } catch {
      body = error.message;
    }
    throw new HttpException(normalizeUpstreamErrorBody(body), status);
  }
  const msg = error instanceof Error ? error.message : 'Unknown error';
  throw new HttpException(
    normalizeUpstreamErrorMessage(msg),
    HttpStatus.BAD_GATEWAY,
  );
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ── OAuth2 ──

  @Post('/v1/oauth2/token')
  async issueClientCredentialsToken(): Promise<TokenRes> {
    try {
      return await this.appService.issueClientCredentialsToken();
    } catch (e) {
      return rethrow(e);
    }
  }

  // ── Generic (country-agnostic) ──

  @Post('/v1/idv/start')
  async idvStart(@Body() body: StartIdvReq): Promise<StartIdvRes> {
    try {
      return await this.appService.idvStart(body);
    } catch (e) {
      return rethrow(e);
    }
  }

  @Post('/v1/idv/kyc/get')
  async idvKycGet(@Body() body: GetKycReq): Promise<GetKycRes> {
    try {
      return await this.appService.idvKycGet(body);
    } catch (e) {
      return rethrow(e);
    }
  }

  // ── Session (vendor-agnostic) ──

  @Post('/v1/idv/sessions/start')
  async idvSessionStart(
    @Body() body: SessionStartReq,
  ): Promise<SessionStartRes> {
    try {
      return await this.appService.idvSessionStart(body);
    } catch (e) {
      return rethrow(e);
    }
  }

  // ── CN start (이미지 포함 시 verify, 없으면 그대로 전달 → 서버에서 분기) ──

  @Post('/v1/idv/cn/start')
  async idvStartCN(
    @Body()
    body: {
      user_id: string;
      callback_url?: string;
      card_image_base64?: string;
      best_frame_base64?: string;
      kyc_policy_id?: string;
    },
  ): Promise<any> {
    try {
      return await this.appService.idvStartCN(body);
    } catch (e) {
      return rethrow(e);
    }
  }

  // ── Per-country start (delegates to generic start with country) ──

  @Post('/v1/idv/:country/start')
  async idvCountryStart(
    @Param('country') country: string,
    @Body()
    body: {
      user_id: string;
      callback_url?: string;
      email?: string;
      kyc_policy_id?: string;
    },
  ): Promise<StartIdvRes> {
    try {
      return await this.appService.idvCountryStart(country, body);
    } catch (e) {
      return rethrow(e);
    }
  }

  // ── Per-country kyc/get (delegates to unified kyc/get with country) ──

  @Post('/v1/idv/:country/kyc/get')
  async idvCountryKycGet(
    @Param('country') country: string,
    @Body() body: { user_id: string },
  ): Promise<GetKycRes> {
    try {
      return await this.appService.idvCountryKycGet(country, body);
    } catch (e) {
      return rethrow(e);
    }
  }
}
