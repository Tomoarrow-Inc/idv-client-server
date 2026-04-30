import { ResponseError } from 'tomo-idv-client-node';
import { rethrowUpstream, UpstreamResponseError } from './upstream-response';

describe('upstream response passthrough', () => {
  it('preserves an already captured upstream response error from proxyPost', async () => {
    // proxyPost already captured the idv-server status/body. Controller catch
    // blocks must not pass it through the generic 502 wrapper path.
    const upstream = new UpstreamResponseError(
      400,
      '{"message":"validation failed"}',
      'application/json;charset=utf-8',
    );

    await expect(rethrowUpstream(upstream)).rejects.toBe(upstream);
  });

  it('preserves upstream status, content type, and body without message rewriting', async () => {
    // This reproduces a plain text idv-server validation error. The BFF must
    // forward the body as-is instead of wrapping it as {statusCode, message}.
    const body = 'validation failed';
    const error = new ResponseError(
      new Response(body, {
        status: 400,
        headers: { 'content-type': 'text/plain;charset=utf-8' },
      }),
    );

    await expect(rethrowUpstream(error)).rejects.toMatchObject({
      status: 400,
      body,
      contentType: 'text/plain;charset=utf-8',
    } satisfies Partial<UpstreamResponseError>);
  });
});
