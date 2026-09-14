import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ResponseError } from 'tomo-idv-client-node';
import { CONTRACT_VERSION_HEADER } from './contract-version';

export { CONTRACT_VERSION_HEADER };

export class UpstreamResponseError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
    readonly contentType?: string,
    readonly versionHeader?: string,
  ) {
    super(`Upstream response ${status}`);
  }
}

@Catch(UpstreamResponseError)
export class UpstreamResponseFilter
  implements ExceptionFilter<UpstreamResponseError>
{
  catch(exception: UpstreamResponseError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception.contentType) {
      response.type(exception.contentType);
    }
    // idv-server attaches the applied contract version to errors raised after
    // version selection. Keep it on the BFF error response so the caller can
    // tell "version applied, handler failed" from "version rejected".
    if (exception.versionHeader) {
      response.setHeader(CONTRACT_VERSION_HEADER, exception.versionHeader);
    }
    response.status(exception.status).send(exception.body);
  }
}

export async function rethrowUpstream(error: unknown): Promise<never> {
  if (error instanceof UpstreamResponseError) {
    throw error;
  }

  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    const contentType = error.response.headers.get('content-type') ?? undefined;
    const versionHeader =
      error.response.headers.get(CONTRACT_VERSION_HEADER) ?? undefined;
    let body = '';
    try {
      body = await error.response.text();
    } catch {
      body = error.message;
    }
    throw new UpstreamResponseError(status, body, contentType, versionHeader);
  }

  const msg = error instanceof Error ? error.message : 'Unknown error';
  throw new HttpException(msg, HttpStatus.BAD_GATEWAY);
}
