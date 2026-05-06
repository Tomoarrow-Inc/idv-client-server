/**
 * Purpose
 * - Swagger UI examples are developer-facing request forms. They must not
 *   prefill email values because idv-client-server must preserve the body a
 *   caller intentionally supplies.
 *
 * Verification
 * - Bootstrap source no longer defines an email example constant.
 * - StartIdvReq and SessionStartReq email fields are not assigned examples.
 * - Deprecated operations from generated SDK specs are filtered before serving
 *   Swagger UI, so api-docs does not advertise removed BFF routes.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readMainSource = () => readFileSync(join(__dirname, 'main.ts'), 'utf8');

describe('Swagger request examples', () => {
  it('does not prefill email examples for IDV start requests', () => {
    const source = readMainSource();

    expect(source).not.toContain("const EMAIL = 'test@example.com'");
    expect(source).not.toMatch(
      /setExample\(\s*['"]StartIdvReq['"]\s*,\s*['"]email['"]/,
    );
    expect(source).not.toMatch(
      /setExample\(\s*['"]SessionStartReq['"]\s*,\s*['"]email['"]/,
    );
  });

  it('filters deprecated SDK operations from Swagger UI', () => {
    // This is a static regression check because main.ts bootstraps the Nest app
    // on import. It verifies api-docs runs generated specs through the
    // deprecated-operation filter before swagger-ui-express receives them.
    const source = readMainSource();

    expect(source).toContain('function removeDeprecatedOperations(doc: any)');
    expect(source).toContain('removeDeprecatedOperations(swaggerDoc)');
    expect(source).not.toContain('SessionStartReq');
  });
});
