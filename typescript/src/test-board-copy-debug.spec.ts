/**
 * Purpose
 * - The deprecated branch test-board is used to reproduce legacy IDV flows.
 *   Each legacy card must be able to copy a complete debug bundle in one
 *   action.
 *
 * Verification
 * - The board declares expected passthrough behavior for all 8 legacy cases.
 * - The copied debug bundle includes request, expected response, actual
 *   response, timing, browser, UI, and error context.
 * - The UI installs a Copy debug button for every registered legacy card.
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

describe('test-board legacy debug copy', () => {
  it('declares expected responses for exactly the 8 legacy cases', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);
    const entries = block.match(/'[^']+'\s*:\s*\{[^\n]+\}/g) ?? [];

    expect(html).toContain('const EXPECTED_RESPONSES = {');
    expect(entries).toHaveLength(legacyCardIds.length);

    for (const cardId of legacyCardIds) {
      expect(block).toContain(`'${cardId}':`);
      expect(block).toContain(
        'expectedResponse: EXPECTED_RESPONSES.legacyForwarded',
      );
    }
  });

  it('builds a debug payload with request, expectation, response, and context', () => {
    const html = readTestBoardHtml();

    expect(html).toContain(
      'function buildCustomDebugPayload(id, overrides = {}) {',
    );
    expect(html).toContain('request: {');
    expect(html).toContain(
      'expectedResponse: cloneDebugValue(cfg?.expectedResponse || null)',
    );
    expect(html).toContain(
      'actualResponse: overrides.actualResponse ?? last.actualResponse ?? null',
    );
    expect(html).toContain('timing: {');
    expect(html).toContain('browserContext: getBrowserDebugContext()');
    expect(html).toContain('uiState: getCustomCardUiState(id)');
    expect(html).toContain('error: overrides.error ?? last.error ?? null');
    expect(html).toContain('copiedAt: overrides.copiedAt ?? null');
  });

  it('stores actual responses without deprecated CN file attachment handling', () => {
    const html = readTestBoardHtml();

    expect(html).toContain(
      'async function apiCallWithDebug(url, options = {})',
    );
    expect(html).toContain('statusText: res.statusText');
    expect(html).toContain('headers: collectResponseHeaders(res.headers)');
    expect(html).toContain(
      'LAST_CUSTOM_RESULTS[id] = buildCustomDebugPayload(id, {',
    );
    expect(html).toContain('actualResponse: createActualResponseDebug(result)');
    expect(html).toContain('lastSentBody: sanitizeDebugValue(parsedBody)');
    expect(html).not.toContain('collectCnFileAttachments(id)');
    expect(html).not.toContain('card_image_base64');
    expect(html).not.toContain('best_frame_base64');
  });

  it('marks expected legacy passthrough responses as successful assertions', () => {
    const html = readTestBoardHtml();

    expect(html).toContain(
      'function matchesExpectedResponse(result, expectedResponse) {',
    );
    expect(html).toContain(
      'expectedResponse.statuses?.includes(result.status)',
    );
    expect(html).toContain('expectedResponse.bodyDoesNotContain');
    expect(html).toContain(
      'const expectedMatched = matchesExpectedResponse(result, cfg.expectedResponse);',
    );
    expect(html).toContain(
      'const shouldMarkSuccess = expectedMatched === null ? ok : expectedMatched;',
    );
    expect(html).toContain(
      "badgeEl.textContent = (expectedMatched === null ? 'OK ' : 'PASS ') + status;",
    );
    expect(html).toContain(
      "badgeEl.textContent = (expectedMatched === null ? 'ERR ' : 'FAIL ') + status;",
    );
  });

  it('installs a Copy debug button for each registered legacy card', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('installCustomDebugCopyButtons();');
    expect(html).toContain('function installCustomDebugCopyButtons() {');
    expect(html).toContain("button.textContent = 'Copy debug'");
    expect(html).toContain(
      "button.addEventListener('click', () => copyCustomDebugCase(id, button))",
    );
    expect(html).toContain('actionsEl.appendChild(button)');
  });

  it('renders every legacy card with debug copy metadata', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);

    expect(html).toContain('id="section-deprecated-compat"');
    expect(html).toContain('legacyForwarded: { statuses:');

    for (const cardId of legacyCardIds) {
      expect(html).toContain(`id="card-${cardId}"`);
      expect(html).toContain(`sendCustom('${cardId}')`);
      expect(block).toContain(`'${cardId}':`);
      expect(block).toContain(
        'expectedResponse: EXPECTED_RESPONSES.legacyForwarded',
      );
    }
  });
});
