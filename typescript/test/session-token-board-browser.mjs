// Run with the existing Playwright runtime (no package installation required):
// PLAYWRIGHT_MODULE_PATH=/path/to/playwright node test/session-token-board-browser.mjs
// Optional BOARD_SCREENSHOT_DIR stores screenshots; fixtures use only fake tokens.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const html = await readFile(new URL('../../test-board/test-board.html', import.meta.url));
const requests = [];
let reply = { status: 200, body: '{"verified":false}', type: 'application/json;charset=utf-8' };
let releaseRequest;
let hold = false;
const server = createServer(async (req, res) => {
  if (req.url.startsWith('/test-board')) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(html);
    return;
  }
  if (req.url === '/v1/idv/session-tokens/introspection') {
    let body = '';
    for await (const chunk of req) body += chunk;
    requests.push({ body, headers: req.headers, url: req.url });
    if (hold) await new Promise(resolve => { releaseRequest = resolve; });
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
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
const page = await context.newPage();
const scriptErrors = [];
page.on('pageerror', error => scriptErrors.push(error.message));
const editor = page.locator('#body-api-session-token');
const send = page.locator('#btn-send-session-token');
const status = page.locator('#session-token-status');
const badge = page.locator('#badge-api-session-token');
const output = page.locator('#json-api-session-token');
const fakeToken = '<malformed-callback> + / ? &';
const screenshots = process.env.BOARD_SCREENSHOT_DIR;

async function state(expected) {
  await page.waitForFunction(value => document.getElementById('session-token-status').dataset.state === value, expected);
  await page.waitForFunction(() => !document.getElementById('btn-send-session-token').disabled);
}

async function checkResponse({ status: code = 200, body, type = 'application/json', expected }) {
  reply = { status: code, body, type };
  await send.click();
  await state(expected);
  assert.equal(await badge.textContent(), `HTTP ${code}`);
  assert.equal(await output.textContent(), code >= 400 || type === 'text/html' ? body : JSON.stringify(JSON.parse(body), null, 2));
}

try {
  await page.goto(`${origin}/test-board`);
  assert.equal(await page.locator('#card-api-session-token').isVisible(), true);
  assert.deepEqual(JSON.parse(await editor.inputValue()), { session_token: '' });
  assert.equal(requests.length, 0);

  await page.goto(`${origin}/test-board?success=1&token=${encodeURIComponent(fakeToken)}`);
  assert.deepEqual(JSON.parse(await editor.inputValue()), { session_token: fakeToken });
  assert.match(await page.locator('#urlTokenInspector').textContent(), /Failed to parse token/);
  assert.equal(requests.length, 0);
  const edited = '{ "session_token": "edited-raw-token", "extra": [1, null] }';
  await editor.fill(edited);
  for (const version of ['v14', 'v13']) {
    const beforeSelection = requests.length;
    await page.locator(`[data-version-id="${version}"]`).click();
    assert.equal(await editor.inputValue(), edited);
    assert.equal(requests.length, beforeSelection);
    await checkResponse({ body: '{"verified":true}', expected: 'valid' });
    assert.equal(requests.at(-1).body, edited);
    assert.equal(requests.at(-1).headers.authorization, undefined);
    assert.equal(requests.at(-1).headers['tomo-api-version'], undefined);
  }
  assert.equal(await status.textContent(), '토큰 유효');

  await page.locator('#btn-load-session-token').click();
  assert.equal(JSON.parse(await editor.inputValue()).session_token, fakeToken);
  await checkResponse({ body: '{"verified":false}', expected: 'invalid' });
  assert.equal(await status.textContent(), '토큰 검증 불일치');
  assert.equal(await page.locator('#card-api-session-token').evaluate(el => el.classList.contains('api-error')), false);
  await page.locator('#btn-copy-debug-api-session-token').click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  assert.equal(clipboard.includes(fakeToken), false);
  assert.equal(clipboard.includes(encodeURIComponent(fakeToken)), false);
  const debug = JSON.parse(clipboard);
  assert.equal(debug.request.body.session_token, '[REDACTED]');
  assert.equal(debug.request.bodyText, '[REDACTED]');
  assert.equal(debug.request.lastSentBody.session_token, '[REDACTED]');
  assert.equal(new URL(debug.browserContext.href).searchParams.get('token'), '[REDACTED]');
  assert.equal(JSON.parse(requests.at(-1).body).session_token, fakeToken);
  if (screenshots) {
    await mkdir(screenshots, { recursive: true });
    await page.locator('#section-session-token').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(screenshots, 'session-token-false.png') });
    await page.locator('#card-api-session-token').screenshot({ path: join(screenshots, 'session-token-card-false.png') });
  }

  for (const body of ['{"verified":"false"}', '{}', 'null', '[]']) {
    await checkResponse({ body, expected: 'schema-error' });
  }
  await checkResponse({ body: '<b>HTML response</b>', type: 'text/html', expected: 'schema-error' });
  assert.equal(await output.locator('b').count(), 0);
  for (const code of [400, 500]) {
    await checkResponse({ status: code, body: '<img src=x onerror=alert(1)> raw upstream error', type: null, expected: 'http-error' });
    assert.equal(await output.locator('img').count(), 0);
  }

  const beforeInvalidJson = requests.length;
  await editor.fill('{invalid JSON');
  await send.click();
  await state('json-error');
  assert.equal(requests.length, beforeInvalidJson);
  await editor.fill('{"session_token":"duplicate-test"}');
  reply = { status: 200, body: '{"verified":false}', type: 'application/json' };
  hold = true;
  await page.evaluate(() => { sendCustom('api-session-token'); sendCustom('api-session-token'); });
  await page.waitForFunction(() => document.getElementById('btn-send-session-token').disabled);
  while (!releaseRequest) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(requests.length, beforeInvalidJson + 1);
  hold = false;
  releaseRequest();
  await state('invalid');

  await page.route('**/v1/idv/session-tokens/introspection', route => route.abort('failed'));
  await send.click();
  await state('network-error');
  assert.equal(await badge.textContent(), 'NETWORK');
  await page.unroute('**/v1/idv/session-tokens/introspection');
  await editor.fill('{"session_token":"\\ud800"}');
  await checkResponse({ body: '{"verified":false}', expected: 'invalid' });
  await page.locator('#btn-copy-debug-api-session-token').click();
  assert.equal(JSON.parse(await page.evaluate(() => navigator.clipboard.readText())).request.body.session_token, '[REDACTED]');

  assert.equal(await page.locator('#card-api-start').isVisible(), true);
  assert.equal(await page.locator('#card-api-result').isVisible(), true);
  assert.equal(await page.locator('#card-api-reset').isVisible(), true);
  assert.equal(await page.locator('#hidden-detailed-api-sections').isVisible(), false);
  assert.equal(await page.locator('#section-deprecated-compat').count(), 0);
  assert.deepEqual(scriptErrors, []);
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['testBoard.contractVersionId']);
  console.log(JSON.stringify({ result: 'PASS', requests: requests.length, screenshots: screenshots || null }));
} finally {
  releaseRequest?.();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
