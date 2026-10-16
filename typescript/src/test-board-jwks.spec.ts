import { readFileSync } from 'fs';
import { join } from 'path';
import { createContext, runInContext } from 'vm';

const html = readFileSync(
  join(__dirname, '../../test-board/test-board.html'),
  'utf8',
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

// Run the actual served script. Only the JWKS display is mocked here; the
// browser fixture verifies real events, one-button layout and safe rendering.
function board() {
  const elements = new Map<string, any>();
  for (const id of [
    'card-jwks',
    'btn-load-jwks',
    'result-jwks',
    'badge-jwks',
    'jwks-status',
    'jwks-content-type',
    'json-jwks',
  ]) {
    if (!html.includes(`id="${id}"`)) continue;
    const classes = new Set<string>();
    elements.set(id, {
      textContent: '',
      disabled: false,
      className: '',
      dataset: {},
      classList: {
        add: (...items: string[]) => items.forEach((item) => classes.add(item)),
        remove: (...items: string[]) =>
          items.forEach((item) => classes.delete(item)),
        contains: (item: string) => classes.has(item),
      },
    });
  }
  const fetchMock = jest.fn();
  const storage = { getItem: jest.fn(() => null), setItem: jest.fn() };
  const context = createContext({
    document: {
      body: { scrollHeight: 900 },
      getElementById: (id: string) => elements.get(id) ?? null,
      querySelector: () => null,
      querySelectorAll: () => [],
    },
    window: {
      location: new URL(
        'http://board.test/test-board?token=callback-must-not-be-sent',
      ),
      addEventListener: jest.fn(),
      innerWidth: 1440,
      innerHeight: 900,
    },
    localStorage: storage,
    sessionStorage: storage,
    URL,
    URLSearchParams,
    fetch: fetchMock,
  });
  runInContext(script, context);
  return {
    fetchMock,
    storage,
    get: (id: string) => elements.get(id),
    run: (source: string) => runInContext(source, context),
    load: () => runInContext('loadJwks()', context),
  };
}

function response(
  status: number,
  text: string,
  contentType: string | null = 'application/json;charset=utf-8',
) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    text: async () => text,
    headers: { get: () => contentType, forEach: () => undefined },
  };
}

describe('JWKS test-board behavior', () => {
  it('offers a standalone card outside POST/body/debug and version registries', () => {
    const page = board();
    expect(page.get('btn-load-jwks')).toBeDefined();
    expect(html).toContain('data-target="section-jwks"');
    expect(html.indexOf('id="section-jwks"')).toBeGreaterThan(
      html.indexOf('id="section-session-token"'),
    );
    expect(
      page.run(
        "Object.values(CUSTOM_CARDS).some(card => card.endpoint === '/.well-known/jwks.json')",
      ),
    ).toBe(false);
    expect(page.run("activeVersionFor('/.well-known/jwks.json')")).toBeNull();
    expect(page.fetchMock).not.toHaveBeenCalled();
  });

  it('does not request on page initialization or either contract selection', () => {
    const page = board();
    page.run("selectContractVersion('v14')");
    page.run("selectContractVersion('v13')");
    expect(page.fetchMock).not.toHaveBeenCalled();
  });

  it.each(['v13', 'v14'])(
    'sends one relative bodyless GET without auth, query or content-type (%s)',
    async (version) => {
      const page = board();
      page.run(`selectContractVersion('${version}')`);
      page.fetchMock.mockResolvedValue(response(200, '{"keys":[]}'));
      await page.load();
      expect(page.fetchMock).toHaveBeenCalledTimes(1);
      expect(page.fetchMock).toHaveBeenCalledWith('/.well-known/jwks.json', {
        method: 'GET',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
      });
    },
  );

  it('shows status, exact content-type and original JSON whitespace with a structural key count', async () => {
    const page = board();
    const text =
      '{  "keys": [ {"kty":"EC","kid":"key-a"}, {"future_key":true} ] }\n';
    page.fetchMock.mockResolvedValue(response(200, text));
    await page.load();
    expect(page.get('badge-jwks').textContent).toBe('HTTP 200');
    expect(page.get('jwks-content-type').textContent).toBe(
      'Content-Type: application/json;charset=utf-8',
    );
    expect(page.get('json-jwks').textContent).toBe(text);
    expect(page.get('jwks-status').dataset.state).toBe('ready');
    expect(page.get('jwks-status').textContent).toContain('공개키 2개');
    expect(page.get('jwks-status').textContent).not.toMatch(
      /토큰 유효|JWT 검증 성공/,
    );
  });

  it('shows an empty keys array as zero keys, independently of a missing content-type', async () => {
    const page = board();
    page.fetchMock.mockResolvedValue(response(200, '{"keys":[]}', null));
    await page.load();
    expect(page.get('jwks-status').dataset.state).toBe('empty');
    expect(page.get('jwks-status').textContent).toContain('공개키 0개');
    expect(page.get('jwks-content-type').textContent).toBe(
      'Content-Type: 없음',
    );
  });

  it.each([
    '{bad json',
    '{}',
    'null',
    '[]',
    '{"keys":null}',
    '{"keys":[null]}',
    '{"keys":[1]}',
    '{"keys":[[]]}',
    '"{\\"keys\\":[]}"',
  ])(
    'distinguishes a malformed JWKS response from HTTP errors: %s',
    async (text) => {
      const page = board();
      page.fetchMock.mockResolvedValue(response(200, text));
      await page.load();
      expect(page.get('badge-jwks').textContent).toBe('HTTP 200');
      expect(page.get('jwks-status').dataset.state).toBe('schema-error');
      expect(page.get('json-jwks').textContent).toBe(text);
    },
  );

  it.each([404, 500])(
    'keeps HTTP %s text literal instead of claiming a JWKS or JWT result',
    async (code) => {
      const page = board();
      const text = '<img src=x onerror=alert(1)> upstream error\n';
      page.fetchMock.mockResolvedValue(response(code, text, null));
      await page.load();
      expect(page.get('badge-jwks').textContent).toBe(`HTTP ${code}`);
      expect(page.get('jwks-status').dataset.state).toBe('http-error');
      expect(page.get('json-jwks').textContent).toBe(text);
      expect(page.get('jwks-content-type').textContent).toBe(
        'Content-Type: 없음',
      );
      expect(page.get('btn-load-jwks').disabled).toBe(false);
    },
  );

  it('prevents concurrent calls, restores the button and allows a later refresh', async () => {
    const page = board();
    let resolveResponse!: (value: unknown) => void;
    page.fetchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );
    const first = page.load();
    expect(page.get('btn-load-jwks').disabled).toBe(true);
    await page.load();
    expect(page.fetchMock).toHaveBeenCalledTimes(1);
    resolveResponse(response(200, '{"keys":[]}'));
    await first;
    expect(page.get('btn-load-jwks').disabled).toBe(false);
    page.fetchMock.mockResolvedValue(response(200, '{"keys":[{}]}'));
    await page.load();
    expect(page.fetchMock).toHaveBeenCalledTimes(2);
  });

  it('clears an earlier response on network failure and restores the button', async () => {
    const page = board();
    page.fetchMock.mockResolvedValueOnce(response(200, '{"keys":[{}]}'));
    await page.load();
    page.fetchMock.mockRejectedValueOnce(new Error('offline'));
    await page.load();
    expect(page.get('badge-jwks').textContent).toBe('NETWORK');
    expect(page.get('jwks-status').dataset.state).toBe('network-error');
    expect(page.get('json-jwks').textContent).toBe('');
    expect(page.get('jwks-content-type').textContent).toBe(
      'Content-Type: 없음',
    );
    expect(page.get('btn-load-jwks').disabled).toBe(false);
  });
});
