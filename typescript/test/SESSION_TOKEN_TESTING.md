# Session token verification (TypeScript only)

`POST /v1/verify/session-token` forwards the request bytes to the configured
`IDV_BASE_URL` without OAuth, cookies or API version headers. The upstream status,
body and Content-Type (including an absent header) are preserved. Network failures
and the 30-second upstream timeout use the existing BFF 502 error response.

Open `/test-board` and use **Session Token 검증**. The initial JSON is
`{"session_token":""}`. A callback URL's `token` query value is prefilled once;
manual edits survive version selection, and the reload button explicitly reloads
that callback value. Only Send calls the API. `200/true` and `200/false` are
separate verification outcomes; malformed response shapes, HTTP errors and
network failures are distinct. Copy debug redacts token input and callback URLs.
Token input is not saved to browser storage.

`verified:true` validates the JWT signature, claims and expiry. It does not check
current KYC state, token revocation or a specific customer's authorization.
Kotlin, Python and Java BFFs are legacy and do not expose this new route.

## Automated checks

From `typescript/` in the normal pnpm development environment:

```sh
pnpm test --runInBand
pnpm test:e2e --runInBand
pnpm build
```

The unit suite uses real Nest HTTP routing and a stub upstream, including raw
malformed JSON, null/scalar/missing bodies, true/false, error body preservation,
missing Content-Type and OAuth/version isolation. E2E smoke imports production
bootstrap to verify the same parsers, board serving and Swagger route. It replaces
the obsolete generated Hello World smoke, whose Supertest namespace import and
removed root route were invalid. Existing OAuth integration tests remain opt-in.

From the `idv-client-server/` directory, build the existing Dockerfile:

```sh
docker build -f typescript/Dockerfile \
  --build-context tomo-idv-client-node=../tomo-idv-client-node \
  --target development -t idv-session-token-bff:test .
```

For unit tests in this image, mount the shared board at `/home/test-board` because
source-relative tests expect the repository layout. The built application itself
uses `TEST_BOARD_PATH=/home/app/test-board/test-board.html`.

```sh
docker run --rm \
  -v "$PWD/test-board:/home/test-board:ro" \
  idv-session-token-bff:test pnpm test --runInBand
```

The browser regression script is `test/session-token-board-browser.mjs`. Run it
with the Playwright package and Chromium available:

```sh
PLAYWRIGHT_MODULE_PATH=/path/to/playwright node test/session-token-board-browser.mjs
```

It serves the actual board HTML with a local stub, covers valid and invalid
responses, and does not require a real signed token. Set `BOARD_SCREENSHOT_DIR`
to a temporary folder to save screenshots with synthetic tokens only.

## Actual server parity (explicit opt-in)

Start the TypeScript BFF with `IDV_BASE_URL` pointing at the same server checked by
`SESSION_TOKEN_UPSTREAM_URL`. No OAuth credentials are required for these tests.
From `typescript/`:

```sh
RUN_SESSION_TOKEN_LIVE_TESTS=true \
SESSION_TOKEN_UPSTREAM_URL=https://dev.tomopayment.com \
SESSION_TOKEN_BFF_URL=http://localhost:4300 \
pnpm test:e2e --runInBand verify-session-token-live.e2e-spec.ts
```

This compares direct and BFF responses for false and malformed-body 400 cases,
including exact response text and Content-Type. The positive scenarios are skipped
unless `SESSION_TOKEN_FILE` points to a private file containing a fresh callback
JWT from a completed flow in that same environment. When provided, it verifies
that token twice and rejects a changed signature. `SESSION_TOKEN_ACCESS_TOKEN_FILE`
optionally supplies a real OAuth access token, expected to return false. These
files must stay outside Git and their contents must not be printed or committed.
The tests do not obtain signing keys or mint substitute session tokens.

Without these files, passing false/400 tests does **not** establish real 200/true
or real access-token rejection coverage. Record those skips explicitly.

## Public JWKS lookup (TypeScript only)

The **JWKS 공개키 조회** card makes a relative `GET /.well-known/jwks.json` only
when its lookup button is clicked. It sends no body, Content-Type, OAuth or API
version headers, and uses `credentials:'omit'`, `cache:'no-store'` and
`referrerPolicy:'no-referrer'` so a callback URL token is not sent as Referer. It displays
the HTTP status, Content-Type (or its absence), and exact response text. A 200
JSON object with an array of key objects displays the number of public keys;
an empty array displays zero. This is a structure check, not JWT verification.
It neither compares a token's kid nor verifies a signature in the browser.

The fixed BFF GET uses the same `IDV_BASE_URL` as session-token verification.
Incoming query/body/auth/cookie/version headers are ignored. It preserves raw
status, Content-Type and body, plus Cache-Control, ETag, Last-Modified, Expires,
Age and Vary when supplied upstream. There is no BFF cache, generated ETag or
synthetic TTL. Redirects are not followed, the upstream timeout is 30 seconds,
and transport failures retain the existing BFF 502 response. Existing POST
parsers and behavior are unchanged.

`src/session-token-jwks.spec.ts` tests the real Nest/stub HTTP boundaries,
including error text, missing Content-Type, all six allowed cache headers,
204/304, inbound credentials, and timeout options. Production bootstrap E2E
also covers the route and card. The isolated browser fixture is
`test/jwks-board-browser.mjs` and follows the same Playwright setup as the session
token fixture. Existing session-token tests remain regression coverage.

Actual public-key parity needs no secret or token fixture. Configure the BFF for
the same upstream, then run from `typescript/`:

```sh
RUN_JWKS_LIVE_TESTS=true \
JWKS_UPSTREAM_URL=https://dev.tomopayment.com \
JWKS_BFF_URL=http://localhost:4300 \
pnpm test:e2e --runInBand jwks-live.e2e-spec.ts
```

This compares direct/BFF status, Content-Type and exact text without pinning
`kid`, `x` or `y`. It checks that the server publishes at least one EC/P-256/ES256
signature key with nonempty public coordinates and kid, and no private `d` field.
A concurrent key rotation may cause a real difference that
needs investigation. Time-dependent Date/Age headers are not compared in the
live test; exact header forwarding is covered by the stub. JWKS success does
not fill the outstanding real callback-token positive verification coverage.
