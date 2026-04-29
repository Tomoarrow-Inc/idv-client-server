/**
 * Purpose
 * - The test-board simulates a customer frontend, so it must not provide
 *   deprecated external auth flows or silently add email defaults to request
 *   bodies.
 *
 * Verification
 * - Deprecated auth UI/endpoint strings are absent from the served HTML.
 * - Custom KYC default body definitions do not include an email field.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readTestBoardHtml = () =>
  readFileSync(join(__dirname, '..', '..', 'test-board', 'test-board.html'), 'utf8');

describe('test-board deprecated auth removal', () => {
  it('does not expose deprecated auth UI, endpoints, or hint controls', () => {
    const html = readTestBoardHtml();
    const deprecatedStrings = [
      ['So', 'cial KYC'].join(''),
      '/v1/idv/' + ['so', 'cial'].join(''),
      ['login', 'hint'].join('_'),
      ['login', 'Hint'].join(''),
      ['Goo', 'gle Sign-In'].join(''),
      ['We', 'Chat'].join(''),
    ];

    for (const deprecatedString of deprecatedStrings) {
      expect(html).not.toContain(deprecatedString);
    }
  });

  it('does not seed email into Custom KYC request bodies', () => {
    const html = readTestBoardHtml();
    const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
    const customCardsEnd = html.indexOf('// Initialize all card textareas');

    expect(customCardsStart).toBeGreaterThanOrEqual(0);
    expect(customCardsEnd).toBeGreaterThan(customCardsStart);

    const customCards = html.slice(customCardsStart, customCardsEnd);
    expect(customCards).not.toMatch(/\bemail\s*:/);
  });

  it('renders idv-server error response bodies without parsing or reformatting', () => {
    const html = readTestBoardHtml();

    expect(html).toContain("const contentType = res.headers.get('content-type') || ''");
    expect(html).toContain('return { ok: res.ok, status: res.status, data, text, contentType };');
    expect(html).toContain('function renderApiResponseBody(ok, data, text) {');
    expect(html).toContain('return ok ? formatApiData(data) : text;');
    expect(html).toContain('jsonEl.textContent = renderApiResponseBody(ok, data, text);');
    expect(html).toContain('j.textContent = renderApiResponseBody(ok, data, text);');
  });
});
