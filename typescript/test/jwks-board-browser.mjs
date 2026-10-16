// Use the existing Playwright runtime; no dependency installation is needed.
// PLAYWRIGHT_MODULE_PATH=/path/to/playwright node test/jwks-board-browser.mjs
// Optional BOARD_SCREENSHOT_DIR saves screenshots. All keys/tokens are fixtures.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const html = await readFile(new URL('../../test-board/test-board.html', import.meta.url));
const requests = [];
const normalBody = '{  "keys": [ { "kty": "EC", "kid": "fixture-key", "crv": "P-256", "x": "fixture-x", "y": "fixture-y" } ] }\n';
let reply = { status: 200, body: normalBody, type: 'application/json;charset=utf-8' };
let hold = false;
let releaseRequest;
let heldRequestSeen;
const server = createServer(async (req, res) => {
  if (req.url.startsWith('/test-board')) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(html);
    return;
  }
  if (req.url === '/.well-known/jwks.json') {
    let body = '';
    for await (const chunk of req) body += chunk;
    requests.push({ method: req.method, url: req.url, headers: req.headers, body });
    if (hold) {
      await new Promise(resolve => {
        releaseRequest = resolve;
        heldRequestSeen?.();
      });
    }
    res.writeHead(reply.status, reply.type ? { 'Content-Type': reply.type } : {});
    res.end(reply.body);
    return;
  }
  res.writeHead(404);
  res.end('Fixture route missing');
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addCookies([{ name: 'fixture_cookie', value: 'must-not-be-forwarded', url: origin }]);
const page = await context.newPage();
const scriptErrors = [];
page.on('pageerror', error => scriptErrors.push(error.message));
await page.addInitScript(() => {
  window.jwksFetchCalls = [];
  const nativeFetch = window.fetch;
  window.fetch = (input, options) => {
    window.jwksFetchCalls.push({ input, options });
    return nativeFetch(input, options);
  };
});
const card = page.locator('#card-jwks');
const button = page.locator('#btn-load-jwks');
const badge = page.locator('#badge-jwks');
const status = page.locator('#jwks-status');
const contentType = page.locator('#jwks-content-type');
const output = page.locator('#json-jwks');
const screenshots = process.env.BOARD_SCREENSHOT_DIR;

async function state(expected) {
  await page.waitForFunction(value => document.getElementById('jwks-status').dataset.state === value, expected);
  await page.waitForFunction(() => !document.getElementById('btn-load-jwks').disabled);
}

async function checkResponse({ code = 200, body, type = 'application/json;charset=utf-8', expected }) {
  reply = { status: code, body, type };
  await button.click();
  await state(expected);
  assert.equal(await badge.textContent(), `HTTP ${code}`);
  assert.equal(await contentType.textContent(), `Content-Type: ${type || '없음'}`);
  assert.equal(await output.textContent(), body);
}

try {
  await page.goto(`${origin}/test-board?token=callback-fixture`);
  assert.equal(await card.isVisible(), true);
  assert.equal(await card.locator('button').count(), 1);
  assert.equal(await card.locator('textarea,input').count(), 0);
  assert.equal(await button.textContent(), '공개키 조회');
  assert.equal(await page.locator('[data-target="section-jwks"]').count(), 1);
  assert.equal(requests.length, 0);
  assert.deepEqual(await page.evaluate(() => window.jwksFetchCalls), []);
  const sessionInput = page.locator('#body-api-session-token');
  await sessionInput.fill('{"session_token":"keep-my-edits"}');

  for (const version of ['v14', 'v13']) {
    const before = requests.length;
    await page.locator(`[data-version-id="${version}"]`).click();
    assert.equal(requests.length, before);
    await checkResponse({ body: normalBody, expected: 'ready' });
    assert.equal(requests.length, before + 1);
    assert.equal(requests.at(-1).method, 'GET');
    assert.equal(requests.at(-1).url, '/.well-known/jwks.json');
    assert.equal(requests.at(-1).body, '');
    for (const header of ['authorization', 'tomo-api-version', 'content-type', 'cookie', 'referer']) {
      assert.equal(requests.at(-1).headers[header], undefined);
    }
    assert.deepEqual(await page.evaluate(() => window.jwksFetchCalls.at(-1)), {
      input: '/.well-known/jwks.json',
      options: { method: 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' },
    });
    assert.equal(await sessionInput.inputValue(), '{"session_token":"keep-my-edits"}');
  }
  assert.match(await status.textContent(), /공개키 1개/);
  assert.doesNotMatch(await status.textContent(), /토큰 유효|JWT 검증 성공/);
  if (screenshots) {
    await mkdir(screenshots, { recursive: true });
    await page.locator('#section-jwks').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(screenshots, 'jwks-board.png') });
    await card.screenshot({ path: join(screenshots, 'jwks-card.png') });
  }

  await checkResponse({ body: '{"keys":[]}', type: null, expected: 'empty' });
  assert.match(await status.textContent(), /공개키 0개/);
  for (const body of ['{broken', '{}', '{"keys":[null]}', '{"keys":[[]]}']) {
    await checkResponse({ body, expected: 'schema-error' });
  }
  const unsafeText = '<img src=x onerror=alert(1)> raw response\n';
  await checkResponse({ body: unsafeText, type: 'text/html', expected: 'schema-error' });
  assert.equal(await output.locator('img').count(), 0);
  for (const code of [404, 500]) {
    await checkResponse({ code, body: unsafeText, type: null, expected: 'http-error' });
    assert.equal(await output.locator('img').count(), 0);
  }

  const beforeDuplicate = requests.length;
  hold = true;
  const seen = new Promise(resolve => { heldRequestSeen = resolve; });
  reply = { status: 200, body: normalBody, type: 'application/json' };
  await page.evaluate(() => { loadJwks(); loadJwks(); });
  let timer;
  try {
    await Promise.race([seen, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('No held JWKS request received')), 5000);
    })]);
  } finally {
    clearTimeout(timer);
  }
  assert.equal(await button.isDisabled(), true);
  assert.equal(requests.length, beforeDuplicate + 1);
  hold = false;
  releaseRequest();
  await state('ready');
  await page.route('**/.well-known/jwks.json', route => route.abort('failed'));
  await button.click();
  await state('network-error');
  assert.equal(await badge.textContent(), 'NETWORK');
  assert.equal(await output.textContent(), '');
  assert.equal(await contentType.textContent(), 'Content-Type: 없음');
  await page.unroute('**/.well-known/jwks.json');
  await checkResponse({ body: normalBody, expected: 'ready' });

  assert.equal(await card.locator('button').count(), 1);
  assert.equal(await page.locator('#btn-copy-debug-api-session-token').count(), 1);
  assert.equal(await page.locator('#hidden-detailed-api-sections').isVisible(), false);
  assert.deepEqual(scriptErrors, []);
  console.log(JSON.stringify({ result: 'PASS', requests: requests.length, screenshots: screenshots || null }));
} finally {
  releaseRequest?.();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
