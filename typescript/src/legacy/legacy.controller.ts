import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ResponseError } from 'tomo-idv-client-node';
import { LegacyService } from './legacy.service';
import type {
  OldSessionBody,
  OldStoreKycBody,
} from './api-contract-old';

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
export class LegacyController {
  constructor(private readonly legacyService: LegacyService) {}

  // ── Old API (Internal — legacy endpoints from old-api.openapi.json) ──

  @Post('/v1/verify/session')
  async oldVerifySession(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldVerifySession(body); }
    catch (e) { return rethrow(e); }
  }

  // US
  @Post('/v1/us/generate_link_token')
  async oldUsGenerateLinkToken(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGenerateLinkToken('us', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/us/results')
  async oldUsResults(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGetResults('us', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/us/store')
  async oldUsStore(@Body() body: OldStoreKycBody) {
    try { return await this.legacyService.oldStoreKyc('us', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/us/verify/kyc')
  async oldUsVerifyKyc(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldVerifyKyc('us', body); }
    catch (e) { return rethrow(e); }
  }

  // UK
  @Post('/v1/uk/generate_link_token')
  async oldUkGenerateLinkToken(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGenerateLinkToken('uk', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/uk/results')
  async oldUkResults(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGetResults('uk', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/uk/store')
  async oldUkStore(@Body() body: OldStoreKycBody) {
    try { return await this.legacyService.oldStoreKyc('uk', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/uk/verify/kyc')
  async oldUkVerifyKyc(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldVerifyKyc('uk', body); }
    catch (e) { return rethrow(e); }
  }

  // CA
  @Post('/v1/ca/generate_link_token')
  async oldCaGenerateLinkToken(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGenerateLinkToken('ca', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/ca/results')
  async oldCaResults(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldGetResults('ca', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/ca/store')
  async oldCaStore(@Body() body: OldStoreKycBody) {
    try { return await this.legacyService.oldStoreKyc('ca', body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/ca/verify/kyc')
  async oldCaVerifyKyc(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldVerifyKyc('ca', body); }
    catch (e) { return rethrow(e); }
  }

  // JP
  @Get('/v1/jp/applicants/:session_id/id_document_ic_information')
  async oldJpIcInfo(@Param('session_id') sessionId: string) {
    try { return await this.legacyService.oldJpGetIcInfo(sessionId); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/jp/store')
  async oldJpStore(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldJpStore(body); }
    catch (e) { return rethrow(e); }
  }

  @Post('/v1/jp/verify/kyc')
  async oldJpVerifyKyc(@Body() body: OldSessionBody) {
    try { return await this.legacyService.oldJpVerifyKyc(body); }
    catch (e) { return rethrow(e); }
  }
}
