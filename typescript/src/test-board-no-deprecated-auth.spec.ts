/**
 * Purpose
 * - The test-board simulates a customer frontend, so it must not provide
 *   deprecated external auth flows, and its request fixtures must keep email
 *   behavior explicit.
 *
 * Verification
 * - Deprecated auth UI/endpoint strings are absent from the served HTML.
 * - Deprecated IDV routes are exposed only as upstream-forwarding checks.
 * - Custom KYC request body textareas are initialized with a default email.
 * - Section 7 keeps the only non-deprecated email-free request body for Plaid
 *   fallback.
 * - Generic start cards use typed kyc_policy bodies.
 * - Dedicated policy cards cover valid Country x Subject/ID Type x Method x
 *   OwnerAssurance cases plus missing-policy default routing.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const readTestBoardHtml = () =>
  readFileSync(
    join(__dirname, '..', '..', 'test-board', 'test-board.html'),
    'utf8',
  );

describe('test-board deprecated auth removal', () => {
  const deprecatedCompatibilityCardIds = [
    'deprecated-generic-kyc-get',
    'deprecated-us-start',
    'deprecated-uk-start',
    'deprecated-ca-start',
    'deprecated-jp-start',
    'deprecated-cn-start',
    'deprecated-us-kyc-get',
    'deprecated-verify-session',
  ];

  const customCardEntry = (html: string, cardId: string) => {
    const customCardsStart = html.indexOf('const CUSTOM_CARDS = {');
    const customCardsEnd = html.indexOf('// Initialize all card textareas');

    expect(customCardsStart).toBeGreaterThanOrEqual(0);
    expect(customCardsEnd).toBeGreaterThan(customCardsStart);

    const customCards = html.slice(customCardsStart, customCardsEnd);
    const match = customCards.match(
      new RegExp(`^\\s*'${cardId}'\\s*:\\s*\\{[^\\n]+\\}`, 'm'),
    );

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

  it('exposes deprecated IDV routes only as upstream forwarding checks', () => {
    // Deprecated route strings may appear only in Section 8, where the board
    // asserts idv-client-server forwards them instead of returning BFF 404.
    const html = readTestBoardHtml();
    const removedUiStrings = [
      'Old API',
      'old-api',
      'sendCustomOld',
      '/v1/idv/jp/kyc/get',
      '/v1/idv/cn/kyc/get',
      '/v1/jp/applicants/',
      '/idv/old',
    ];

    for (const removedUiString of removedUiStrings) {
      expect(html).not.toContain(removedUiString);
    }

    expect(html).toContain('id="section-deprecated-compat"');
    expect(html).toContain('EXPECTED_RESPONSES.deprecatedForwarded');
    expect(html).toContain('deprecatedForwarded: { notStatus: 404');

    for (const cardId of deprecatedCompatibilityCardIds) {
      const entry = customCardEntry(html, cardId);

      expect(html).toContain(`id="card-${cardId}"`);
      expect(html).toContain(`sendCustom('${cardId}')`);
      expect(entry).toContain(
        'expectedResponse: EXPECTED_RESPONSES.deprecatedForwarded',
      );
      expect(entry).toContain('includeDefaultEmail: false');
    }
  });

  it('shows only public API tests and Deprecated in the visible custom board', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('id="section-api-tests"');
    expect(html).toContain('id="card-api-start"');
    expect(html).toContain('id="card-api-result"');
    expect(html).toContain('id="card-api-result-user"');
    expect(html).toContain("sendCustom('api-start')");
    expect(html).toContain("sendCustom('api-result')");
    expect(html).toContain("sendCustom('api-result-user')");
    expect(html).toContain(
      'user_id와 country로 해당 유저의 특정 국적 결과를 조회합니다.',
    );
    expect(html).toContain(
      'user_id만으로 해당 유저가 가진 모든 국적과 policy 결과를 조회합니다.',
    );
    expect(html).not.toContain('id="card-api-result-policy"');
    expect(html).not.toContain('id="card-api-result-country"');
    expect(html).toContain('id="hidden-detailed-api-sections"');
    expect(html).toContain('data-target="section-api-tests"');
    expect(html).not.toContain('data-target="section-plaid"');
    expect(html).not.toContain('data-target="section-policy"');
  });

  it('renders URL token details above Access Token only when token query exists', () => {
    const html = readTestBoardHtml();

    expect(html).toContain('class="card hidden" id="section-url-token"');
    expect(html).toContain('id="urlTokenInspector"');
    expect(html.indexOf('id="section-url-token"')).toBeLessThan(
      html.indexOf('id="section-token"'),
    );
    expect(html).toContain('function initUrlTokenInspector() {');
    expect(html).toContain("const tokenStr = params.get('token');");
    expect(html).toContain("const keyStr = params.get('key');");
    expect(html).toContain('if (!tokenStr) return;');
    expect(html).toContain('function renderUrlPpidHighlight(container, ppid) {');
    expect(html).toContain("label.textContent = 'PPID (payload.sub)';");
    expect(html).toContain("button.textContent = 'Copy';");
    expect(html).toContain("button.addEventListener('click', () => copyUrlPpid(String(ppid), button));");
    expect(html).toContain('async function copyUrlPpid(ppid, button) {');
    expect(html).toContain('renderUrlPpidHighlight(inspector, jwt.payload.sub);');
    expect(html).toContain("renderDecodedJsonBlock(inspector, 'Decoded Payload', jwt.payload);");
    expect(html).toContain("renderDecodedJsonBlock(inspector, 'Decoded Public Key', jwkJson);");
    expect(html).toContain('initUrlTokenInspector();');
  });

  it('renders two visible result query cases without default email or policy', () => {
    const html = readTestBoardHtml();
    const resultCases = [
      ['api-result', "country: 'us'"],
      ['api-result-user', ''],
    ];

    for (const [cardId, country] of resultCases) {
      const entry = customCardEntry(html, cardId);

      expect(entry).toContain("endpoint: '/v1/idv/result'");
      expect(entry).toContain(
        'expectedResponse: EXPECTED_RESPONSES.resultOk',
      );
      expect(entry).toContain('includeDefaultEmail: false');
      expect(entry).toContain(
        "user_id: '7840a4a65ee46998228be1300fe0e6dbf295157d7734c8d22b71d79f68e917fb'",
      );
      expect(entry).not.toContain('email:');
      expect(entry).not.toContain('kyc_policy:');
      if (country) expect(entry).toContain(country);
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
    // unless a case has a reason to preserve an exact request shape.
    expect(html).toContain('function withDefaultEmail(body) {');
    expect(html).toContain('function customCardBody(id) {');
    expect(html).toContain(
      'return cfg.includeDefaultEmail === false ? body : withDefaultEmail(body);',
    );
    expect(html).toContain('function resizeJsonEditor(el) {');
    expect(html).toContain(
      'el.value = JSON.stringify(customCardBody(id), null, 2);',
    );
    expect(html).toContain('resizeJsonEditor(el);');
    expect(html).toContain(
      "el.addEventListener('input', () => resizeJsonEditor(el));",
    );
    expect(customCards.match(/includeDefaultEmail:\s*false/g)).toHaveLength(
      deprecatedCompatibilityCardIds.length + 3,
    );
  });

  it('keeps section 7 as the explicit Plaid email fallback request', () => {
    const html = readTestBoardHtml();
    const entry = customCardEntry(html, 'email-fallback-plaid');

    // Section 7 is the only active API case that intentionally omits email so
    // the test board can verify idv-app collects email before Plaid redirect.
    expect(html).toContain('id="section-email-fallback"');
    expect(html).toContain('id="card-email-fallback-plaid"');
    expect(html).toContain("sendCustom('email-fallback-plaid')");
    expect(entry).toContain("endpoint: '/v1/idv/start'");
    expect(entry).toContain(
      'expectedResponse: EXPECTED_RESPONSES.emailFallback',
    );
    expect(entry).toContain('includeDefaultEmail: false');
    expect(entry).toContain('kyc_policy: personalInfoSmsPolicy()');
    expect(entry).not.toContain('email:');
  });

  it('keeps no-country start examples on typed policy validation', () => {
    const html = readTestBoardHtml();
    const removedPolicyIdField = ['kyc', 'policy', 'id'].join('_');
    const noCountryStartCardIds = [
      'generic-start-none-verified',
      'generic-start-none-new',
    ];

    for (const cardId of noCountryStartCardIds) {
      const entry = customCardEntry(html, cardId);

      // Country is the top-level policy classifier. These cards intentionally
      // omit country while sending a typed policy so validation rejects the
      // unsupported UNKNOWN-country combination.
      expect(entry).toContain("endpoint: '/v1/idv/start'");
      expect(entry).toContain(
        'expectedResponse: EXPECTED_RESPONSES.policyUnsupported',
      );
      expect(entry).toContain('kyc_policy: personalInfoSmsPolicy()');
      expect(entry).not.toContain(`${removedPolicyIdField}:`);
      expect(entry).not.toContain('country:');
    }
  });

  it('keeps generic country start cards on typed kyc_policy request bodies', () => {
    const html = readTestBoardHtml();
    const removedPolicyIdField = ['kyc', 'policy', 'id'].join('_');
    const countryStartCases = [
      [
        'generic-start-us-new',
        "country: 'us'",
        'kyc_policy: personalInfoSmsPolicy()',
      ],
      [
        'generic-start-jp-new',
        "country: 'jp'",
        "documentPolicy('id_card', 'government_id_verf', ownerVerf('document_secret'))",
      ],
      [
        'generic-start-cn-new',
        "country: 'cn'",
        "documentPolicy('id_card', 'government_id_verf', noOwnerAssurance())",
      ],
    ];

    for (const [cardId, country, policy] of countryStartCases) {
      const entry = customCardEntry(html, cardId);

      // /v1/idv/start must receive Country and kyc_policy as public policy
      // parameters; vendor/action names must not be part of the request body.
      expect(entry).toContain("endpoint: '/v1/idv/start'");
      expect(entry).toContain(country);
      expect(entry).toContain(policy);
      expect(entry).toContain('expectedResponse: EXPECTED_RESPONSES.startOk');
      expect(entry).not.toContain(`${removedPolicyIdField}:`);
      expect(entry).not.toContain('plaid_');
      expect(entry).not.toContain('liquid_');
      expect(entry).not.toContain('tencent_');
    }
  });

  it('separates valid typed policy cases from missing-policy default routing', () => {
    const html = readTestBoardHtml();
    const removedPolicyIdField = ['kyc', 'policy', 'id'].join('_');

    const validPolicyCases = [
      [
        'policy-us-personal-info-sms',
        "country: 'us'",
        'kyc_policy: personalInfoSmsPolicy()',
      ],
      [
        'policy-us-residential-card-ocr',
        "country: 'us'",
        "documentPolicy('residential_card', 'document_ocr_check', noOwnerAssurance())",
      ],
      [
        'policy-jp-idcard-gov',
        "country: 'jp'",
        "documentPolicy('id_card', 'government_id_verf', ownerVerf('document_secret'))",
      ],
      [
        'policy-jp-passport-ocr',
        "country: 'jp'",
        "documentPolicy('passport', 'document_ocr_check', noOwnerAssurance())",
      ],
      [
        'policy-cn-idcard-gov',
        "country: 'cn'",
        "documentPolicy('id_card', 'government_id_verf', noOwnerAssurance())",
      ],
      [
        'policy-cn-idcard-doc-auth-owner-check',
        "country: 'cn'",
        "documentPolicy('id_card', 'document_authenticity_check', ownerCheck('submitted_doc_selfie_match'))",
      ],
      [
        'policy-cn-idcard-ocr-owner-check',
        "country: 'cn'",
        "documentPolicy('id_card', 'document_ocr_check', ownerCheck('submitted_doc_selfie_match'))",
      ],
    ];

    for (const [cardId, country, policy] of validPolicyCases) {
      const entry = customCardEntry(html, cardId);

      // These cards verify the public policy algebra cases. The request body
      // must remain vendor-neutral and use typed policy parameters.
      expect(entry).toContain("endpoint: '/v1/idv/start'");
      expect(entry).toContain(country);
      expect(entry).toContain(policy);
      expect(entry).toContain('expectedResponse: EXPECTED_RESPONSES.startOk');
      expect(entry).not.toContain(`${removedPolicyIdField}:`);
    }

    const missingPolicy = customCardEntry(html, 'policy-missing');
    expect(missingPolicy).toContain("endpoint: '/v1/idv/start'");
    expect(missingPolicy).toContain(
      'expectedResponse: EXPECTED_RESPONSES.startOk',
    );
    expect(missingPolicy).not.toContain('kyc_policy:');
    expect(missingPolicy).not.toContain(`${removedPolicyIdField}:`);

    expect(html).not.toContain(['policy', 'legacy', 'id'].join('-'));
    expect(html).not.toContain(['policy', 'Legacy', 'Id'].join(''));
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
