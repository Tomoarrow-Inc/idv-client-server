import { readFileSync } from 'fs';
import { join } from 'path';
import { createContext, runInContext } from 'vm';

const html = readFileSync(
  join(__dirname, '../../test-board/test-board.html'),
  'utf8',
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
const cardId = 'api-session-token';

// Execute the served script, with only the new card's DOM mocked. Browser tests
// separately exercise real DOM events, clipboard, visibility and rendering.
function board(query = '') {
  const elements = new Map<string, any>();
  for (const id of [
    `card-${cardId}`,
    `body-${cardId}`,
    `result-${cardId}`,
    `json-${cardId}`,
    `badge-${cardId}`,
    'session-token-status',
    'session-token-source',
    'btn-send-session-token',
    'btn-load-session-token',
  ]) {
    if (!html.includes(`id="${id}"`)) continue;
    const classes = new Set<string>();
    elements.set(id, {
      value: '',
      textContent: '',
      disabled: false,
      style: {},
      scrollHeight: 180,
      className: '',
      dataset: {},
      classList: {
        add: (...items: string[]) => items.forEach((item) => classes.add(item)),
        remove: (...items: string[]) =>
          items.forEach((item) => classes.delete(item)),
        contains: (item: string) => classes.has(item),
      },
      querySelector: () => null,
      addEventListener: jest.fn(),
    });
  }
  const fetchMock = jest.fn();
  const clipboard = jest.fn().mockResolvedValue(undefined);
  const storage = { getItem: jest.fn(() => null), setItem: jest.fn() };
  const location = new URL(`http://board.test/test-board${query}`);
  const context = createContext({
    document: {
      body: { scrollHeight: 900 },
      getElementById: (id: string) => elements.get(id) ?? null,
      querySelector: () => null,
      querySelectorAll: () => [],
    },
    window: {
      location,
      addEventListener: jest.fn(),
      innerWidth: 1440,
      innerHeight: 900,
    },
    navigator: {
      clipboard: { writeText: clipboard },
      languages: ['ko'],
      language: 'ko',
      userAgent: 'test',
    },
    localStorage: storage,
    sessionStorage: storage,
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
    context,
    fetchMock,
    clipboard,
    storage,
    get: (id: string) => elements.get(id),
    run: (source: string) => runInContext(source, context),
    send: () => runInContext(`sendCustom('${cardId}')`, context),
  };
}

function response(status: number, body: unknown, text?: string) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    text: async () => text ?? JSON.stringify(body),
    headers: {
      get: () => 'application/json;charset=utf-8',
      forEach: () => undefined,
    },
  };
}

describe('session token test-board behavior', () => {
  it('always offers an unauthenticated, email-free card without automatic requests', () => {
    const page = board();
    expect(page.get(`body-${cardId}`)).toBeDefined();
    expect(JSON.parse(page.get(`body-${cardId}`).value)).toEqual({
      session_token: '',
    });
    expect(page.run(`activeVersionFor('/v1/verify/session-token')`)).toBeNull();
    expect(page.fetchMock).not.toHaveBeenCalled();
    expect(page.storage.setItem).not.toHaveBeenCalled();
  });

  it('prefills malformed callback text once and only reloads it explicitly', () => {
    const token = '<malformed> + / ? &';
    const page = board(`?token=${encodeURIComponent(token)}`);
    const editor = page.get(`body-${cardId}`);
    expect(JSON.parse(editor.value)).toEqual({ session_token: token });
    editor.value = '{"session_token":"edited"}';
    page.run('initSessionTokenCard()');
    expect(JSON.parse(editor.value).session_token).toBe('edited');
    page.run('loadSessionTokenFromUrl()');
    expect(JSON.parse(editor.value).session_token).toBe(token);
    expect(page.fetchMock).not.toHaveBeenCalled();
  });

  it.each(['v13', 'v14'])(
    'sends edited JSON unchanged without OAuth/version headers (%s)',
    async (version) => {
      const page = board();
      page.run(`activeContractVersionId = '${version}'`);
      const text = '{ "session_token": "  original  ", "extra": [null, 7] }';
      page.get(`body-${cardId}`).value = text;
      page.fetchMock.mockResolvedValue(response(200, { verified: false }));
      await page.send();
      expect(page.fetchMock).toHaveBeenCalledWith('/v1/verify/session-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      });
      expect(page.fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    [true, 'valid', '토큰 유효'],
    [false, 'invalid', '토큰 검증 불일치'],
  ])(
    'distinguishes HTTP 200 from verified=%s',
    async (verified, state, label) => {
      const page = board();
      page.fetchMock.mockResolvedValue(response(200, { verified }));
      await page.send();
      expect(page.get(`badge-${cardId}`).textContent).toBe('HTTP 200');
      expect(page.get('session-token-status').dataset.state).toBe(state);
      expect(page.get('session-token-status').textContent).toBe(label);
      expect(page.get(`card-${cardId}`).classList.contains('api-error')).toBe(
        false,
      );
    },
  );

  it.each([{ verified: 'false' }, {}, null, [], '<b>unexpected HTML</b>'])(
    'rejects invalid success schema %j',
    async (body) => {
      const page = board();
      page.fetchMock.mockResolvedValue(
        response(200, body, typeof body === 'string' ? body : undefined),
      );
      await page.send();
      expect(page.get('session-token-status').dataset.state).toBe(
        'schema-error',
      );
      expect(page.get('session-token-status').textContent).toContain(
        '응답 형식 오류',
      );
    },
  );

  it.each([400, 500])(
    'preserves HTTP %s response text separately from token validity',
    async (status) => {
      const page = board();
      const text = '<img src=x onerror=alert(1)> upstream error';
      page.fetchMock.mockResolvedValue(response(status, null, text));
      await page.send();
      expect(page.get(`json-${cardId}`).textContent).toBe(text);
      expect(page.get(`badge-${cardId}`).textContent).toBe(`HTTP ${status}`);
      expect(page.get('session-token-status').dataset.state).toBe('http-error');
    },
  );

  it('reports local JSON syntax and network errors without claiming verified=false', async () => {
    const page = board();
    page.get(`body-${cardId}`).value = '{broken';
    await page.send();
    expect(page.fetchMock).not.toHaveBeenCalled();
    expect(page.get('session-token-status').dataset.state).toBe('json-error');
    page.get(`body-${cardId}`).value = '{"session_token":"test"}';
    page.fetchMock.mockRejectedValue(new Error('offline'));
    await page.send();
    expect(page.get('session-token-status').dataset.state).toBe(
      'network-error',
    );
    expect(page.get('btn-send-session-token').disabled).toBe(false);
  });

  it('prevents overlapping requests and re-enables the send button', async () => {
    const page = board();
    let resolveResponse!: (value: unknown) => void;
    page.fetchMock.mockReturnValue(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );
    const first = page.send();
    expect(page.get('btn-send-session-token').disabled).toBe(true);
    await page.send();
    expect(page.fetchMock).toHaveBeenCalledTimes(1);
    resolveResponse(response(200, { verified: false }));
    await first;
    expect(page.get('btn-send-session-token').disabled).toBe(false);
  });

  it('redacts all debug copies, including edited malformed JSON and callback URLs', async () => {
    const token = 'sensitive-session-token';
    const page = board(`?success=1&token=${token}&token=second-secret`);
    page.fetchMock.mockResolvedValue(response(200, { verified: false }));
    await page.send();
    expect(page.fetchMock.mock.calls[0][1].body).toContain(token);
    const debug = page.run(`buildCustomDebugPayload('${cardId}')`);
    expect(debug.request.body).toEqual({ session_token: '[REDACTED]' });
    expect(debug.request.lastSentBody).toEqual({ session_token: '[REDACTED]' });
    expect(JSON.stringify(debug)).not.toContain(token);
    expect(JSON.stringify(debug)).not.toContain('second-secret');
    expect(debug.browserContext.href).toContain('success=1');
    page.get(`body-${cardId}`).value = `{"session_token":"${token}`;
    await page.send();
    expect(
      JSON.stringify(page.run(`buildCustomDebugPayload('${cardId}')`)),
    ).not.toContain(token);
  });

  it('can send and redact a JSON token containing an unpaired surrogate', async () => {
    const page = board();
    const text = '{"session_token":"\\ud800"}';
    page.get(`body-${cardId}`).value = text;
    page.fetchMock.mockResolvedValue(response(200, { verified: false }));
    await expect(page.send()).resolves.toBeUndefined();
    expect(page.fetchMock.mock.calls[0][1].body).toBe(text);
    expect(page.get('btn-send-session-token').disabled).toBe(false);
    expect(
      page.run(`buildCustomDebugPayload('${cardId}')`).request.body,
    ).toEqual({ session_token: '[REDACTED]' });
  });
});
