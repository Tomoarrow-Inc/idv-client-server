/**
 * Purpose
 * - The deprecated branch needs a customer-facing board that exercises only
 *   the legacy compatibility routes currently listed in Section 8.
 *
 * Verification
 * - Deprecated external auth UI stays absent.
 * - The visible board is token issuance plus the 8 legacy cards.
 * - CUSTOM_CARDS contains only those 8 legacy cases.
 * - Legacy response grading catches BFF-level missing-route and missing-token
 *   errors while still allowing upstream legacy errors to pass through.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const legacyCardIds = [
  'deprecated-generic-kyc-get',
  'deprecated-us-start',
  'deprecated-uk-start',
  'deprecated-ca-start',
  'deprecated-jp-start',
  'deprecated-cn-start',
  'deprecated-us-kyc-get',
  'deprecated-verify-session',
];

const readTestBoardHtml = () =>
  readFileSync(
    join(__dirname, '..', '..', 'test-board', 'test-board.html'),
    'utf8',
  );

const customCardsBlock = (html: string) => {
  const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
  const customCardsEnd = html.indexOf('// Initialize all card textareas');

  expect(customCardsStart).toBeGreaterThanOrEqual(0);
  expect(customCardsEnd).toBeGreaterThan(customCardsStart);

  return html.slice(customCardsStart, customCardsEnd);
};

const customCardEntries = (html: string) =>
  customCardsBlock(html).match(/'[^']+'\s*:\s*\{[^\n]+\}/g) ?? [];

describe('deprecated test-board legacy-only surface', () => {
  it('does not restore deprecated external auth UI or hint controls', () => {
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

  it('renders a legacy-only board around the existing 8 deprecated cards', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('<h1>Deprecated KYC Test Board</h1>');
    expect(html).toContain('id="section-token"');
    expect(html).toContain('id="section-deprecated-compat"');
    expect(html).toContain('legacy-hidden" hidden aria-hidden="true"');
    expect(html).toContain('data-target="section-deprecated-compat">1 Legacy');

    const quickJumpBlock = html.slice(
      html.indexOf('<nav class="qj-sidebar'),
      html.indexOf('</nav>'),
    );
    expect(quickJumpBlock).not.toContain('section-plaid');
    expect(quickJumpBlock).not.toContain('section-email-fallback');

    for (const cardId of legacyCardIds) {
      expect(html).toContain(`id="card-${cardId}"`);
      expect(html).toContain(`sendCustom('${cardId}')`);
    }
  });

  it('registers only the 8 legacy cards in CUSTOM_CARDS', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);
    const entries = customCardEntries(html);

    expect(entries).toHaveLength(legacyCardIds.length);
    expect(html).toContain('legacyForwarded: { statuses:');

    for (const cardId of legacyCardIds) {
      expect(block).toContain(`'${cardId}':`);
      expect(block).toContain(
        `expectedResponse: EXPECTED_RESPONSES.legacyForwarded`,
      );
      expect(block).toContain('includeDefaultEmail: false');
    }

    expect(block).not.toContain("'email-fallback-plaid':");
    expect(block).not.toContain("'policy-us-personal-info-sms':");
    expect(block).not.toContain("'generic-start-us-new':");
  });

  it('grades legacy passthrough without accepting BFF missing-route errors', () => {
    const html = readTestBoardHtml();

    expect(html).toContain("bodyDoesNotContain: ['Cannot POST', 'No access token found']");
    expect(html).toContain('expectedResponse.bodyDoesNotContain');
    expect(html).toContain('const bodyExcludesMatch = excludedBodies.every');
    expect(html).toContain(
      'return statusMatches && bodyMatches && bodyExcludesMatch;',
    );
  });

  it('renders idv-server error response bodies without parsing or reformatting', () => {
    const html = readTestBoardHtml();

    expect(html).toContain(
      "const contentType = res.headers.get('content-type') || ''",
    );
    expect(html).toContain('statusText: res.statusText');
    expect(html).toContain('headers: collectResponseHeaders(res.headers)');
    expect(html).toContain('function renderApiResponseBody(ok, data, text) {');
    expect(html).toContain('return ok ? formatApiData(data) : text;');
    expect(html).toContain(
      'jsonEl.textContent = renderApiResponseBody(ok, data, text);',
    );
    expect(html).toContain('actualResponse: createActualResponseDebug(result)');
  });
});
