import { ResponseError } from 'tomo-idv-client-node';
import { rethrowUpstream, UpstreamResponseError } from './upstream-response';

describe('upstream response passthrough', () => {
  it('preserves upstream status, content type, and body without message rewriting', async () => {
    // This reproduces a plain text idv-server validation error. The BFF must
    // forward the body as-is instead of wrapping it as {statusCode, message}.
    const body =
      'kyc_policy_id \uAC12\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.';
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
