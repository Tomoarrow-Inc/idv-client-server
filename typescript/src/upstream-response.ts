import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ResponseError } from 'tomo-idv-client-node';

export class UpstreamResponseError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
    readonly contentType?: string,
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
    response.status(exception.status).send(exception.body);
  }
}

export async function rethrowUpstream(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    const status = error.response.status || HttpStatus.BAD_GATEWAY;
    const contentType = error.response.headers.get('content-type') ?? undefined;
    let body = '';
    try {
      body = await error.response.text();
    } catch {
      body = error.message;
    }
    throw new UpstreamResponseError(status, body, contentType);
  }

  const msg = error instanceof Error ? error.message : 'Unknown error';
  throw new HttpException(msg, HttpStatus.BAD_GATEWAY);
}
