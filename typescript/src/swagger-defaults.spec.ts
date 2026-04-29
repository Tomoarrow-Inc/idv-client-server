/**
 * Purpose
 * - Swagger UI examples are developer-facing request forms. They must not
 *   prefill email values because idv-client-server must preserve the body a
 *   caller intentionally supplies.
 *
 * Verification
 * - Bootstrap source no longer defines an email example constant.
 * - StartIdvReq and SessionStartReq email fields are not assigned examples.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readMainSource = () => readFileSync(join(__dirname, 'main.ts'), 'utf8');

describe('Swagger request examples', () => {
  it('does not prefill email examples for IDV start requests', () => {
    const source = readMainSource();

    expect(source).not.toContain("const EMAIL = 'test@example.com'");
    expect(source).not.toMatch(/setExample\(\s*['"]StartIdvReq['"]\s*,\s*['"]email['"]/);
    expect(source).not.toMatch(/setExample\(\s*['"]SessionStartReq['"]\s*,\s*['"]email['"]/);
  });
});
