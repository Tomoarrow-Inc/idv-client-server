/**
 * Purpose
 * - The test-board simulates a customer frontend, so it must not provide
 *   deprecated external auth flows, and its request fixtures must keep email
 *   behavior explicit.
 *
 * Verification
 * - Deprecated auth UI/endpoint strings are absent from the served HTML.
 * - Custom KYC request body textareas are initialized with a default email.
 * - Section 7 keeps the only email-free request body for Plaid fallback.
 * - US start cards keep an explicit default policy id while dedicated policy
 *   cards isolate default, empty, and incorrect kyc_policy_id inputs.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readTestBoardHtml = () =>
  readFileSync(join(__dirname, '..', '..', 'test-board', 'test-board.html'), 'utf8');

describe('test-board deprecated auth removal', () => {
  const customCardEntry = (html: string, cardId: string) => {
    const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
    const customCardsEnd = html.indexOf('// Initialize all card textareas');

    expect(customCardsStart).toBeGreaterThanOrEqual(0);
    expect(customCardsEnd).toBeGreaterThan(customCardsStart);

    const customCards = html.slice(customCardsStart, customCardsEnd);
    const match = customCards.match(new RegExp(`'${cardId}'\\s*:\\s*\\{[^\\n]+\\}`));

    expect(match).not.toBeNull();
    return match?.[0] ?? '';
  };

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

  it('initializes default Custom KYC request bodies with email', () => {
    const html = readTestBoardHtml();
    const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
    const customCardsEnd = html.indexOf('// Initialize all card textareas');

    expect(customCardsStart).toBeGreaterThanOrEqual(0);
    expect(customCardsEnd).toBeGreaterThan(customCardsStart);

    const customCards = html.slice(customCardsStart, customCardsEnd);
    // Default request body rendering must go through the shared email injector
    // so customer examples do not accidentally exercise Plaid email fallback.
    expect(html).toContain('function withDefaultEmail(body) {');
    expect(html).toContain('function customCardBody(id) {');
    expect(html).toContain('return cfg.includeDefaultEmail === false ? body : withDefaultEmail(body);');
    expect(html).toContain('if (el) el.value = JSON.stringify(customCardBody(id), null, 2);');
    expect(customCards.match(/includeDefaultEmail:\s*false/g)).toHaveLength(1);
  });

  it('keeps section 7 as the explicit Plaid email fallback request', () => {
    const html = readTestBoardHtml();
    const entry = customCardEntry(html, 'email-fallback-plaid');

    // Section 7 is the only case that intentionally omits email so the test
    // board can verify idv-app collects email before Plaid redirect.
    expect(html).toContain('id="section-email-fallback"');
    expect(html).toContain('id="card-email-fallback-plaid"');
    expect(html).toContain("sendCustom('email-fallback-plaid')");
    expect(entry).toContain("endpoint: '/v1/idv/us/start'");
    expect(entry).toContain('expectedResponse: EXPECTED_RESPONSES.emailFallback');
    expect(entry).toContain('includeDefaultEmail: false');
    expect(entry).toContain("kyc_policy_id: 'test-policy-verify'");
    expect(entry).not.toContain('email:');
  });

  it('keeps no-country start examples with an explicit blank policy id', () => {
    const html = readTestBoardHtml();
    const noCountryStartCardIds = ['generic-start-none-verified', 'generic-start-none-new'];

    for (const cardId of noCountryStartCardIds) {
      const entry = customCardEntry(html, cardId);

      // The 4-1 body intentionally sends kyc_policy_id="" without country so
      // tests cover the policy-empty normalization path before provider routing.
      expect(entry).toContain("endpoint: '/v1/idv/start'");
      expect(entry).toContain("kyc_policy_id: ''");
      expect(entry).not.toContain('country:');
    }
  });

  it('keeps US start cards explicit about the selected default policy id', () => {
    const html = readTestBoardHtml();
    const usStartCardIds = ['us-start-verified', 'us-start-new'];

    for (const cardId of usStartCardIds) {
      const entry = customCardEntry(html, cardId);

      // These top-level US start examples must not silently remove
      // kyc_policy_id. Policy edge cases are covered by the dedicated cards.
      expect(entry).toContain("endpoint: '/v1/idv/us/start'");
      expect(entry).toContain("kyc_policy_id: 'test-policy-verify'");
      expect(entry).toContain('expectedResponse: EXPECTED_RESPONSES.startOk');
    }
  });

  it('separates default, empty, and incorrect policy request bodies', () => {
    const html = readTestBoardHtml();

    const defaultPolicy = customCardEntry(html, 'policy-default');
    // Default policy means intentional omission so the server fallback path is
    // tested separately from explicit empty and incorrect policy input.
    expect(defaultPolicy).toContain("endpoint: '/v1/idv/us/start'");
    expect(defaultPolicy).toContain('expectedResponse: EXPECTED_RESPONSES.startOk');
    expect(defaultPolicy).not.toContain('kyc_policy_id:');

    const emptyPolicy = customCardEntry(html, 'policy-empty');
    // Empty policy is a client input validation case and must stay distinct
    // from the default fallback omission path.
    expect(emptyPolicy).toContain("endpoint: '/v1/idv/us/start'");
    expect(emptyPolicy).toContain('expectedResponse: EXPECTED_RESPONSES.policyEmpty');
    expect(emptyPolicy).toContain("kyc_policy_id: ''");

    const incorrectPolicy = customCardEntry(html, 'policy-incorrect');
    // Incorrect policy exercises the policy-not-found path with a non-empty id.
    expect(incorrectPolicy).toContain("endpoint: '/v1/idv/us/start'");
    expect(incorrectPolicy).toContain('expectedResponse: EXPECTED_RESPONSES.policyIncorrect');
    expect(incorrectPolicy).toContain("kyc_policy_id: 'nonexistent-policy-xyz'");
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
