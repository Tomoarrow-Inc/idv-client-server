/**
 * Purpose
 * - The deprecated branch intentionally exposes only the legacy compatibility
 *   routes needed by the legacy-only test-board.
 *
 * Verification
 * - Old standalone legacy modules are still gone.
 * - AppController registers the exact 8 legacy routes from the board.
 * - AppService uses transparent proxy helpers for legacy routes instead of
 *   regenerating or hand-editing SDK code.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const legacyRoutePaths = [
  '/v1/idv/kyc/get',
  '/v1/idv/us/start',
  '/v1/idv/uk/start',
  '/v1/idv/ca/start',
  '/v1/idv/jp/start',
  '/v1/idv/cn/start',
  '/v1/idv/us/kyc/get',
  '/v1/verify/session',
];

const readSource = (name: string) =>
  readFileSync(join(__dirname, name), 'utf8');

describe('deprecated IDV implementation surface', () => {
  it('keeps removed standalone legacy implementation files out of the app', () => {
    const legacyFiles = [
      'legacy/api-contract-old.ts',
      'legacy/legacy.controller.ts',
      'legacy/legacy.module.ts',
      'legacy/legacy.service.ts',
      'swagger/old-api.openapi.json',
    ];

    for (const legacyFile of legacyFiles) {
      expect(existsSync(join(__dirname, legacyFile))).toBe(false);
    }
  });

  it('registers only the exact legacy routes needed by the test-board', () => {
    const appModule = readSource('app.module.ts');
    const appController = readSource('app.controller.ts');

    expect(appModule).not.toContain('LegacyModule');

    for (const routePath of legacyRoutePaths) {
      expect(appController).toContain(`@Post('${routePath}')`);
    }

    expect(appController).not.toContain('/v1/idv/:country/start');
    expect(appController).not.toContain('/v1/idv/:country/kyc/get');
    expect(appController).not.toContain('/v1/idv/jp/kyc/get');
    expect(appController).not.toContain('/v1/idv/cn/kyc/get');
  });

  it('proxies legacy routes without relying on deprecated generated SDK methods', () => {
    const appService = readSource('app.service.ts');

    expect(appService).toContain('async legacyKycGet(body: unknown)');
    expect(appService).toContain('async legacyCountryStart(');
    expect(appService).toContain('async legacyUsKycGet(body: unknown)');
    expect(appService).toContain('async legacyVerifySession(body: unknown)');
    expect(appService).toContain('private async proxyPost(');
    expect(appService).toContain('throw new UpstreamResponseError(');

    expect(appService).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
    expect(appService).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
  });
});
