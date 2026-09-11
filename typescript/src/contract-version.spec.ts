/**
 * Purpose
 * - /v1/idv/result is the only idv-server endpoint that reads Tomo-API-Version,
 *   so the BFF must forward it untouched and surface the version idv-server
 *   actually applied.
 *
 * Verification
 * - The controller echoes the applied version as a response header.
 * - No response header is set when idv-server did not send one (version
 *   parsing failed, so no contract was applied).
 * - Errors raised after version selection keep the applied version.
 * - Only /v1/idv/result carries the header parameter.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ResponseError } from 'tomo-idv-client-node';
import { AppController } from './app.controller';
import {
  CONTRACT_VERSION_HEADER,
  UpstreamResponseError,
  UpstreamResponseFilter,
  rethrowUpstream,
} from './upstream-response';

const readSource = (name: string) =>
  readFileSync(join(__dirname, name), 'utf8');

const fakeResponse = () => ({ setHeader: jest.fn() });

describe('result contract version passthrough', () => {
  it('echoes the version idv-server applied', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: '1.4' }),
    };
    const controller = new AppController(service as never);

    const body = await controller.idvResult(
      { user_id: 'ppid.x' } as never,
      '1.4',
      res as never,
    );

    expect(service.idvResult).toHaveBeenCalledWith({ user_id: 'ppid.x' }, '1.4');
    expect(res.setHeader).toHaveBeenCalledWith(CONTRACT_VERSION_HEADER, '1.4');
    expect(body).toEqual({ result: {} });
  });

  it('passes undefined through when the caller sent no version header', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: '1.3' }),
    };
    const controller = new AppController(service as never);

    await controller.idvResult(
      { user_id: 'ppid.x' } as never,
      undefined,
      res as never,
    );

    expect(service.idvResult).toHaveBeenCalledWith(
      { user_id: 'ppid.x' },
      undefined,
    );
    expect(res.setHeader).toHaveBeenCalledWith(CONTRACT_VERSION_HEADER, '1.3');
  });

  it('sets no version header when idv-server applied no contract', async () => {
    const res = fakeResponse();
    const service = {
      idvResult: jest
        .fn()
        .mockResolvedValue({ body: { result: {} }, version: undefined }),
    };
    const controller = new AppController(service as never);

    await controller.idvResult(
      { user_id: 'ppid.x' } as never,
      undefined,
      res as never,
    );

    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it('keeps the applied version on upstream errors', async () => {
    // idv-server attaches the applied version to handler errors raised after
    // version selection, and omits it when the version itself was rejected.
    const upstream = {
      status: 403,
      headers: {
        get: jest.fn((name: string) =>
          name === CONTRACT_VERSION_HEADER
            ? '1.4'
            : name === 'content-type'
              ? 'application/json;charset=utf-8'
              : null,
        ),
      },
      text: jest.fn().mockResolvedValue('{"message":"denied"}'),
    };

    await expect(
      rethrowUpstream(new ResponseError(upstream as never, 'error')),
    ).rejects.toMatchObject({
      status: 403,
      body: '{"message":"denied"}',
      versionHeader: '1.4',
    });
  });

  it('writes the version header onto the forwarded error response', () => {
    const send = jest.fn();
    const response = {
      type: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(() => ({ send })),
    };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    };

    new UpstreamResponseFilter().catch(
      new UpstreamResponseError(403, '{"message":"denied"}', undefined, '1.4'),
      host as never,
    );

    expect(response.setHeader).toHaveBeenCalledWith(
      CONTRACT_VERSION_HEADER,
      '1.4',
    );
    expect(response.status).toHaveBeenCalledWith(403);
    expect(send).toHaveBeenCalledWith('{"message":"denied"}');
  });

  it('omits the version header when the version was rejected', () => {
    const send = jest.fn();
    const response = {
      type: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(() => ({ send })),
    };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    };

    new UpstreamResponseFilter().catch(
      new UpstreamResponseError(400, '{"message":"Unsupported"}'),
      host as never,
    );

    expect(response.setHeader).not.toHaveBeenCalled();
  });

  it('reads the header on /v1/idv/result only', () => {
    // Static regression check: idv-server declares Tomo-API-Version on the
    // result endpoint alone, so no other route should claim to honor it.
    const source = readSource('app.controller.ts');
    const headerDecorators = source.match(/@Headers\('tomo-api-version'\)/g);

    expect(headerDecorators).toHaveLength(1);
    const resultRoute = source.slice(source.indexOf("@Post('/v1/idv/result')"));
    expect(resultRoute).toContain("@Headers('tomo-api-version')");
  });
});
