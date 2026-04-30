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

  it('marks expected error responses as successful test-board assertions', () => {
    const html = readTestBoardHtml();

    // Policy validation cards intentionally expect 400 responses. The board
    // should grade them against expectedResponse instead of treating every
    // non-2xx response as a failed customer test case.
    expect(html).toContain('function matchesExpectedResponse(result, expectedResponse) {');
    expect(html).toContain('expectedResponse.statuses?.includes(result.status)');
    expect(html).toContain('const expectedMatched = matchesExpectedResponse(result, cfg.expectedResponse);');
    expect(html).toContain('const shouldMarkSuccess = expectedMatched === null ? ok : expectedMatched;');
    expect(html).toContain("badgeEl.textContent = (expectedMatched === null ? 'OK ' : 'PASS ') + status;");
    expect(html).toContain("badgeEl.textContent = (expectedMatched === null ? 'ERR ' : 'FAIL ') + status;");
  });

  it('installs a Copy debug button for each Custom KYC card', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('installCustomDebugCopyButtons();');
    expect(html).toContain('function installCustomDebugCopyButtons() {');
    expect(html).toContain("button.textContent = 'Copy debug'");
    expect(html).toContain("button.addEventListener('click', () => copyCustomDebugCase(id, button))");
    expect(html).toContain('actionsEl.appendChild(button)');
  });

  it('covers typed kyc_policy routing cases with debug copy metadata', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);

    const policyCases = [
      ['policy-us-personal-info-sms', 'EXPECTED_RESPONSES.startOk'],
      ['policy-us-residential-card-ocr', 'EXPECTED_RESPONSES.startOk'],
      ['policy-jp-idcard-gov', 'EXPECTED_RESPONSES.startOk'],
      ['policy-jp-passport-ocr', 'EXPECTED_RESPONSES.startOk'],
      ['policy-cn-idcard-gov', 'EXPECTED_RESPONSES.startOk'],
      ['policy-cn-idcard-doc-auth-owner-check', 'EXPECTED_RESPONSES.startOk'],
      ['policy-cn-idcard-ocr-owner-check', 'EXPECTED_RESPONSES.startOk'],
      ['policy-missing', 'EXPECTED_RESPONSES.startOk'],
    ];

    for (const [cardId, expectedResponse] of policyCases) {
      // The typed policy cards are debug fixtures for customer-reproducible
      // /v1/idv/start routing, so each one needs rendered UI and expected
      // response metadata for the copied debug payload.
      expect(html).toContain(`id="card-${cardId}"`);
      expect(html).toContain(`sendCustom('${cardId}')`);
      expect(block).toContain(`'${cardId}':`);
      expect(block).toContain(`expectedResponse: ${expectedResponse}`);
    }
  });

  it('covers the email fallback case with debug copy metadata', () => {
    const html = readTestBoardHtml();
    const block = customCardsBlock(html);

    // The fallback card intentionally omits default email, but it still needs
    // the same debug-copy metadata as every other Custom KYC request.
    expect(html).toContain('id="section-email-fallback"');
    expect(html).toContain('id="card-email-fallback-plaid"');
    expect(html).toContain("sendCustom('email-fallback-plaid')");
    expect(block).toContain("'email-fallback-plaid':");
    expect(block).toContain('expectedResponse: EXPECTED_RESPONSES.emailFallback');
    expect(block).toContain('includeDefaultEmail: false');
  });
});
