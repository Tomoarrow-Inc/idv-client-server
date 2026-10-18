import { readFileSync } from 'fs';
import { join } from 'path';
import { createContext, runInContext } from 'vm';

const html = readFileSync(
  join(__dirname, '../../test-board/test-board.html'),
  'utf8',
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

// Run the actual board script. The browser smoke separately checks real DOM
// events and the board served by the built Nest app.
function board() {
  const elements = new Map<string, any>();
  for (const card of ['api-start', 'api-result', 'api-reset']) {
    for (const prefix of ['body', 'card', 'result', 'json', 'badge']) {
      const classes = new Set<string>();
      elements.set(`${prefix}-${card}`, {
        value: '',
        textContent: '',
        style: {},
        scrollHeight: 180,
        dataset: {},
        classList: {
          add: (...items: string[]) =>
            items.forEach((item) => classes.add(item)),
          remove: (...items: string[]) =>
            items.forEach((item) => classes.delete(item)),
          contains: (item: string) => classes.has(item),
        },
        querySelector: () => null,
        addEventListener: jest.fn(),
        insertBefore: jest.fn(),
      });
    }
  }
  const fetchMock = jest.fn();
  const context = createContext({
    document: {
      body: { scrollHeight: 900 },
      getElementById: (id: string) => elements.get(id) ?? null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ append: jest.fn(), appendChild: jest.fn() }),
    },
    window: {
      location: new URL('http://board.test/test-board'),
      addEventListener: jest.fn(),
      innerWidth: 1440,
      innerHeight: 900,
    },
    navigator: { languages: ['ko'], language: 'ko', userAgent: 'test' },
    localStorage: { getItem: () => null, setItem: jest.fn() },
    URL,
    URLSearchParams,
    fetch: fetchMock,
    performance: { now: () => 1 },
    setTimeout: jest.fn(),
    Intl,
    TextEncoder,
  });
  runInContext(script, context);
  return {
    get: (id: string) => elements.get(id),
    run: (source: string) => runInContext(source, context),
    body: (card = 'api-start') =>
      JSON.parse(elements.get(`body-${card}`).value),
    fetchMock,
  };
}

function response(status: number, text: string) {
  return {
    ok: status < 400,
    status,
    statusText: '',
    text: async () => text,
    headers: { get: () => 'application/json', forEach: () => undefined },
  };
}

describe('test-board document selection examples', () => {
  it('preserves the explicit US SMS default with JSON null and no automatic request', () => {
    const page = board();
    expect(page.body()).toMatchObject({
      country: 'us',
      kyc_policy: {
        subject: { kind: 'personal_info', id_type: null },
        method: 'personal_info_verf',
        owner_assurance: { kind: 'owner_verf', type: 'sms_otp' },
      },
    });
    expect(page.fetchMock).not.toHaveBeenCalled();
  });

  it.each(['document-selection', 'document-selection-allowlist'])(
    'fills a countryless document request with JSON null (%s)',
    (example) => {
      const page = board();
      const result = page.get('body-api-result').value;
      const reset = page.get('body-api-reset').value;
      expect(html).toContain(`onclick="loadStartExample('${example}')"`);
      page.run(`loadStartExample('${example}')`);
      const body = page.body();
      expect(body).not.toHaveProperty('country');
      expect(body.kyc_policy).toEqual({
        subject: { kind: 'document', id_type: null },
        method: 'document_ocr_check',
        owner_assurance: { kind: 'no_owner_assurance' },
      });
      expect(body.email).toBe('test-board+test-board-user@example.com');
      expect(body.redirect_url_success).toBe(
        'http://board.test/test-board?success=1',
      );
      expect(body.redirect_url_fail).toBe(
        'http://board.test/test-board?fail=1',
      );
      if (example.endsWith('allowlist')) {
        expect(body.allowed_document_id_types).toEqual(['passport', 'id_card']);
      } else {
        expect(body).not.toHaveProperty('allowed_document_id_types');
      }
      expect(page.get('body-api-result').value).toBe(result);
      expect(page.get('body-api-reset').value).toBe(reset);
      expect(page.fetchMock).not.toHaveBeenCalled();
    },
  );

  it('restores the existing explicit US example without retaining an allowlist', () => {
    const page = board();
    const original = page.body();
    page.run("loadStartExample('document-selection-allowlist')");
    page.run("loadStartExample('personal-info-sms')");
    expect(page.body()).toEqual(original);
    expect(page.body('api-reset')).not.toHaveProperty(
      'allowed_document_id_types',
    );
  });

  it.each(['v13', 'v14'])(
    'sends the generated allowlist through the relative BFF route (%s)',
    async (version) => {
      const page = board();
      page.run("loadStartExample('document-selection-allowlist')");
      page.run(`activeContractVersionId = '${version}'`);
      const body = page.body();
      page.fetchMock.mockResolvedValue(response(200, '{}'));
      await page.run("sendCustom('api-start')");
      expect(page.fetchMock).toHaveBeenCalledTimes(1);
      expect(page.fetchMock).toHaveBeenCalledWith('/v1/idv/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(version === 'v14' ? { 'Tomo-API-Version': '1.4' } : {}),
        },
        body: JSON.stringify(body),
      });
    },
  );

  it('does not repair manually entered string null or suppress the upstream error', async () => {
    const page = board();
    const body = {
      email: 'synthetic@example.com',
      kyc_policy: {
        subject: { kind: 'document', id_type: 'null' },
        method: 'document_ocr_check',
        owner_assurance: { kind: 'no_owner_assurance', type: 'null' },
      },
    };
    page.get('body-api-start').value = JSON.stringify(body);
    const error =
      "Error in $['kyc_policy'].subject['id_type']: Unknown id type: null";
    page.fetchMock.mockResolvedValue(response(400, error));
    await page.run("sendCustom('api-start')");
    expect(JSON.parse(page.fetchMock.mock.calls[0][1].body)).toEqual(body);
    expect(page.get('json-api-start').textContent).toBe(error);
    expect(page.get('badge-api-start').textContent).toBe('FAIL 400');
  });
});
