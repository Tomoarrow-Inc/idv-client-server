/**
 * Purpose
 * - The test-board is used to reproduce customer-facing IDV flows. Each Custom
 *   KYC card must be able to copy a complete debug bundle in one action.
 *
 * Verification
 * - Every Custom KYC case declares an expected response.
 * - The copied debug bundle includes request, expected response, actual
 *   response, timing, browser, UI, attachment, and error context.
 * - The UI installs a Copy debug button for every Custom KYC card.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readTestBoardHtml = () =>
  readFileSync(join(__dirname, '..', '..', 'test-board', 'test-board.html'), 'utf8');

const customCardsBlock = (html: string) => {
  const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
  const customCardsEnd = html.indexOf('// Initialize all card textareas');

  expect(customCardsStart).toBeGreaterThanOrEqual(0);
  expect(customCardsEnd).toBeGreaterThan(customCardsStart);

  return html.slice(customCardsStart, customCardsEnd);
};

describe('test-board Custom KYC debug copy', () => {
  it('declares expected responses for every Custom KYC case', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);
    const entries = block.match(/'[^']+'\s*:\s*\{[^\n]+\}/g) ?? [];

    expect(html).toContain('const EXPECTED_RESPONSES = {');
    expect(entries.length).toBeGreaterThan(20);

    for (const entry of entries) {
      expect(entry).toContain('expectedResponse:');
    }
  });

  it('builds a debug payload with request, expectation, response, and context', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('function buildCustomDebugPayload(id, overrides = {}) {');
    expect(html).toContain('request: {');
    expect(html).toContain('expectedResponse: cloneDebugValue(cfg?.expectedResponse || null)');
    expect(html).toContain('actualResponse: overrides.actualResponse ?? last.actualResponse ?? null');
    expect(html).toContain('timing: {');
    expect(html).toContain('browserContext: getBrowserDebugContext()');
    expect(html).toContain('uiState: getCustomCardUiState(id)');
    expect(html).toContain('error: overrides.error ?? last.error ?? null');
    expect(html).toContain('copiedAt: overrides.copiedAt ?? null');
  });

  it('stores actual responses and sanitizes large base64 request fields', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('async function apiCallWithDebug(url, options = {})');
    expect(html).toContain('statusText: res.statusText');
    expect(html).toContain('headers: collectResponseHeaders(res.headers)');
    expect(html).toContain('LAST_CUSTOM_RESULTS[id] = buildCustomDebugPayload(id, {');
    expect(html).toContain('actualResponse: createActualResponseDebug(result)');
    expect(html).toContain('lastSentBody: sanitizeDebugValue(parsedBody)');
    expect(html).toContain('collectCnFileAttachments(id)');
  });

  it('installs a Copy debug button for each Custom KYC card', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('installCustomDebugCopyButtons();');
    expect(html).toContain('function installCustomDebugCopyButtons() {');
    expect(html).toContain("button.textContent = 'Copy debug'");
    expect(html).toContain("button.addEventListener('click', () => copyCustomDebugCase(id, button))");
    expect(html).toContain('actionsEl.appendChild(button)');
  });
});
