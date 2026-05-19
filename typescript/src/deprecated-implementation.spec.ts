/**
 * Purpose
 * - Legacy module files stay removed, while idv-server deprecated endpoints
 *   remain available through transparent BFF forwarding.
 *
 * Verification
 * - Legacy module source files are gone.
 * - AppModule no longer imports/registers LegacyModule.
 * - AppController registers deprecated compatibility route decorators.
 * - AppService forwards deprecated compatibility calls without generated SDK
 *   body shaping.
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

  it('registers deprecated compatibility IDV routes without the legacy module', () => {
    const appModule = readSource('app.module.ts');
    const appController = readSource('app.controller.ts');

    expect(appModule).not.toContain('LegacyModule');
    expect(appController).toContain("@Post('/v1/idv/kyc/get')");
    expect(appController).toContain("@Post('/v1/idv/:country/start')");
    expect(appController).toContain("@Post('/v1/idv/:country/kyc/get')");
    expect(appController).toContain("@Post('/v1/verify/session')");
  });

  it('forwards deprecated compatibility calls without deprecated SDK methods', () => {
    const appService = readSource('app.service.ts');

    expect(appService).toContain('async proxyPost(path: string, body: unknown)');
    expect(appService).toContain('fetch(`${this.resolveBaseUrl()}${path}`');
    expect(appService).not.toMatch(/\bv1IdvKycGetPost\s*\(/);
    expect(appService).not.toMatch(/\bv1Idv(Us|Uk|Ca|Jp|Cn)StartPost\s*\(/);
    expect(appService).not.toMatch(
      /\bidv(KycGet|StartCN|CountryStart|CountryKycGet)\s*\(/,
    );
  });
});
