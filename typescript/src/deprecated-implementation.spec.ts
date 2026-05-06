/**
 * Purpose
 * - Deprecated IDV endpoints must be removed from idv-client-server's runtime
 *   implementation, even if the generated SDK contract still contains them.
 *
 * Verification
 * - Legacy module source files are gone.
 * - AppModule no longer imports/registers LegacyModule.
 * - AppController no longer registers deprecated route decorators.
 * - AppService no longer calls deprecated SDK methods.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const readSource = (name: string) =>
  readFileSync(join(__dirname, name), 'utf8');

describe('deprecated IDV implementation removal', () => {
  it('removes the legacy module implementation files', () => {
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

  it('does not register legacy or deprecated IDV routes', () => {
    const appModule = readSource('app.module.ts');
    const appController = readSource('app.controller.ts');

    expect(appModule).not.toContain('LegacyModule');
    expect(appController).not.toContain('/v1/idv/kyc/get');
    expect(appController).not.toContain('/v1/idv/cn/start');
    expect(appController).not.toContain('/v1/idv/:country/start');
    expect(appController).not.toContain('/v1/idv/:country/kyc/get');
    expect(appController).not.toContain('/v1/verify/session');
  });

  it('does not call deprecated SDK methods from AppService', () => {
    const appService = readSource('app.service.ts');

    expect(appService).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
    expect(appService).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
    expect(appService).not.toMatch(
      /\bidv(KycGet|StartCN|CountryStart|CountryKycGet)\s*\(/,
    );
  });
});
