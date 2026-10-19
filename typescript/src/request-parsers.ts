import type { NestExpressApplication } from '@nestjs/platform-express';

/** Keep verification input raw so idv-server owns JSON/body validation. */
export function configureRequestParsers(app: NestExpressApplication): void {
  app.useBodyParser('raw', {
    limit: '10mb',
    type: (req) =>
      req.method === 'POST' &&
      /^\/v1\/idv\/session-tokens\/introspection\/?$/i.test(
        (req.url ?? '').split('?')[0],
      ),
  });
  // Existing authenticated routes retain their original JSON parsing policy.
  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '10mb' });
}
