# idv-client-server

Backend For Frontend (BFF) server for idv-client. Handles OAuth2 client-assertion flow and proxies requests to idv-server (Haskell backend).

## 프로젝트 목적

이 프로젝트는 idv-server API가 클라이언트에게 배포됐을 때 **클라이언트 측 기능을 시뮬레이션**하는 모듈이다.

### 핵심 원칙

1. **투명한 메시지 전달**: 클라이언트가 idv-server로부터 받는 응답 메시지를 변환 없이 그대로 전달해야 한다. BFF 레이어에서 필드명 변환(snake_case ↔ camelCase)이나 구조 변경을 하지 않는다.
2. **투명한 에러 전달**: idv-server로부터 받는 에러 정보(HTTP status code, error body)를 그대로 클라이언트에 전달해야 한다. `rethrow()`가 upstream 에러의 status와 JSON body를 보존한다.
3. **자동 서버 인증**: 클라이언트측 OAuth2 인증(client_credentials + JWT assertion)을 자동으로 처리한다. 엔드유저들은 인증 과정을 의식하지 않고 이 서버를 통해 idv-server API에 접근한다.

### 설계 귀결

- Generated OpenAPI 클라이언트는 `modelPropertyNaming=original,paramNaming=original` 설정으로 스펙의 snake_case 필드명을 그대로 유지한다.
- `IdvServerClient`는 transparent proxy로 동작하며, request body를 변환 없이 generated API에 그대로 전달한다.
- 에러 응답은 `error.response.json()`을 우선 시도하여 구조화된 에러 정보를 보존한다.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7 (target ES2023, module: nodenext)
- **Package Manager**: pnpm (NOT npm)
- **Runtime**: Node.js 20
- **Testing**: Jest 30 + Supertest

## Build & Run

```bash
pnpm install

# Development
pnpm start:dev              # Watch mode with hot reload
pnpm start:debug            # Debug + watch mode

# Production build
pnpm build                  # nest build
pnpm start:prod             # Run compiled output (node dist/main)

# Testing
pnpm test                   # Unit tests (Jest)
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report
pnpm test:e2e               # End-to-end tests

# Linting & formatting
pnpm lint                   # ESLint with auto-fix
pnpm format                 # Prettier (src + test)

# API client generation
pnpm gen                    # Orval + openapi-generator-cli (runs from ci/contracts/)
pnpm sync-client            # Copy generated client from ci/ to src/sdk/generated/
```

## Architecture & Data Flow

```
idv-client (React SPA)
    ↓ HTTP (snake_case JSON body)
AppController (NestJS, src/app.controller.ts)
    ↓ delegates to
AppService (src/app.service.ts)
    ↓ snake_case → camelCase conversion
IdvServerClient (src/sdk/idv-client.ts)
    ↓ uses generated OpenAPI DefaultApi
DefaultApi (src/sdk/generated/apis/DefaultApi.ts)
    ↓ HTTP (camelCase JSON body)
idv-server (Haskell backend)
```

### Key Design Patterns

- **Case Convention**: Client sends snake_case → BFF manually converts to camelCase for generated SDK → idv-server. The conversion is done inline in `IdvServerClient` methods (e.g. `body.user_id` → `{ userId: body.user_id }`), NOT via the generic `case-converter.ts` utility.
- **Auth Flow**: OAuth2 `client_credentials` grant with `private_key_jwt` (ES256/P-256). The BFF creates a JWT client assertion using `tomo-idv-node.ts`, exchanges it for an access token via `/v1/oauth2/token`, and stores the token in `StateService` (in-memory singleton).
- **Token Management**: Access token is stored in `StateService` under key `access_token`. Most IDV endpoints require `this.requireAccessToken()` which reads from state. Token must be obtained first via `POST /v1/oauth2/token`.
- **Error Forwarding**: `rethrow()` in `app.controller.ts` converts `ResponseError` from the generated SDK into NestJS `HttpException`, preserving the upstream status code and body.

## Source Structure (Detailed)

```
src/
  main.ts              — Bootstrap NestJS app, CORS enabled (origin: *)
  app.module.ts         — Root module: providers = [IdvServerClient, AppService, StateService]
  app.controller.ts     — All HTTP routes, delegates to AppService, wraps errors with rethrow()
  app.service.ts        — Business logic, uses IdvServerClient + StateService
  state.service.ts      — In-memory singleton Map<string,any> with pub/sub, backup/restore
  app.controller.spec.ts — Integration test for OAuth2 flow (skipped unless RUN_IDV_INTEGRATION_TESTS=true)

  idvServer/
    idvServerClient.ts  — Re-exports IdvServerClient from sdk/
    customFetch.ts       — Custom fetch wrapper (resolves IDV_BASE_URL, error shaping) — currently unused by main flow

  sdk/
    index.ts            — Barrel: exports IdvServerClient, body types, response types, enums, auth utils
    idv-client.ts       — IdvServerClient class wrapping generated DefaultApi with snake→camel conversion
    api-contract.ts     — Wire-format request body types (snake_case, aligned with controller HTTP body)
    tomo-idv-node.ts    — createClientAssertion() + buildTokenRequest() for OAuth2 JWT (ES256/P-256)
    case-converter.ts   — Generic toSnakeCaseKeys / toCamelCaseKeys utilities
    idv-client.integration.spec.ts — Full OAuth2 integration test (same content as app.controller.spec.ts)
    generated/          — OpenAPI Generator output (DO NOT edit manually)
      runtime.ts        — BaseAPI, ResponseError, FetchError, Configuration
      apis/DefaultApi.ts — All endpoint methods (v1Idv*Post, v1Oauth2TokenPost, etc.)
      models/           — TypeScript interfaces for all request/response types
```

## API Endpoints

All routes are on the root controller (`@Controller()`), all are POST except health checks (GET).

### OAuth2
- `POST /v1/oauth2/token` → Issues access token (client_credentials + JWT assertion)

### Generic (country-agnostic)
- `POST /v1/idv/start` → Start IDV (requires country in body)
- `POST /v1/idv/kyc/get` → Get KYC result (requires country in body)

### Per-Country IDV Endpoints (pattern: `/v1/idv/{country}/...`)

**US, UK, CA** (Plaid provider):
- `POST /v1/idv/{us|uk|ca}/start` → Start IDV (requires access_token)
- `POST /v1/idv/{us|uk|ca}/kyc/get` → Get KYC (requires access_token)
- `POST /v1/idv/{us|uk|ca}/kyc/put` → Put KYC (no access_token needed)
- `POST /v1/idv/{us|uk|ca}/cookie/start` → Cookie-based start (no access_token needed)
- `GET  /v1/idv/{us|uk|ca}/health` → Health check

**JP** (Liquid provider):
- `POST /v1/idv/jp/start` → Start IDV (requires access_token)
- `POST /v1/idv/jp/kyc/get` → Get KYC (requires access_token)
- `POST /v1/idv/jp/kyc/put` → Put KYC (no access_token needed)
- `POST /v1/idv/jp/cookie/start` → Cookie-based start (no access_token needed)
- `POST /v1/idv/jp/notification` → Liquid notification webhook
- `GET  /v1/idv/jp/health` → Health check

**CN** (Tencent/TomoIdv provider):
- `POST /v1/idv/cn/start` → Start IDV (requires access_token)
- `POST /v1/idv/cn/token` → Issue CN-specific token (requires access_token)
- `POST /v1/idv/cn/kyc/get` → Get KYC (requires access_token)
- `POST /v1/idv/cn/result/web` → Get web result (no access_token needed)
- `GET  /v1/idv/cn/health` → Health check
- `POST /v1/idv/cn/mock/start` → Mock start (requires access_token)
- `POST /v1/idv/cn/mock/token` → Mock token (requires access_token)
- `POST /v1/idv/cn/mock/kyc/get` → Mock KYC get (requires access_token)

### Session Tokens
- `POST /v1/idv/plaid/token/session` → Plaid session token
- `POST /v1/idv/liquid/token/session` → Liquid session token

### Login Ticket
- `POST /v1/idv/login-ticket` → Login ticket exchange

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `IDV_BASE_URL` | Yes | Base URL for idv-server (default: `http://idv-server-ghci`) |
| `TOMO_IDV_CLIENT_ID` | Yes | OAuth2 client ID for JWT assertion |
| `TOMO_IDV_SECRET` | Yes | Base64url-encoded EC P-256 JWK private key |
| `PORT` | No | Server port (default: 3000, mapped to 4300 in docker-compose) |
| `RUN_IDV_INTEGRATION_TESTS` | No | Set to `true` to run OAuth2 integration tests |
| `AS_SIGNING_JWK` | No | AS public JWK for verifying access tokens in tests |

Also accepts `IDV_SERVER` and `IDV_BASEURL` as fallbacks for `IDV_BASE_URL`.

## Testing

- **Unit tests**: `*.spec.ts` in `src/` — `pnpm test`
- **Integration test**: `app.controller.spec.ts` — skipped by default, set `RUN_IDV_INTEGRATION_TESTS=true`
- **E2E tests**: `test/` directory with `jest-e2e.json` config — `pnpm test:e2e`
- **Coverage**: `coverage/` directory — `pnpm test:cov`

## Generated Code (DO NOT edit manually)

`src/sdk/generated/` is auto-generated from the OpenAPI spec via `openapi-generator-cli`.

**To regenerate**: Run `pnpm gen` from idv-client-server root (or `npm run gen` from ci/), then `pnpm sync-client` to copy output.

**Source**: `ci/contracts/openapi-generator/generated/idv-client-server/` → copied to `src/sdk/generated/`

**Key generated files**:
- `runtime.ts` — `BaseAPI`, `Configuration`, `ResponseError`, `FetchError`
- `apis/DefaultApi.ts` — All endpoint methods
- `models/` — TypeScript interfaces (PlaidStartIdvResp, TokenResponse, Country, etc.)

## Docker Compose Profiles

`docker-compose.yaml`에 환경별 서비스가 정의되어 있으며, 이미지 태그: `test-0.0.2.4`

| Service | Port | IDV_BASE_URL |
|---|---|---|
| `client-server` | — | (build only) |
| `client-server-test` | 8080:3000 | `https://test.tomopayment.com` |
| `client-server-dev` | 8081:3000 | `https://dev.tomopayment.com` |
| `client-server-prod` | 8082:3000 | `https://api.tomopayment.com` |

## Important Conventions

- **pnpm only** — never use npm
- **Wire format**: Controller receives/returns snake_case JSON. IdvServerClient converts to camelCase for generated SDK.
- **Access token**: In-memory only (StateService singleton). Lost on server restart.
- **CORS**: Fully open (origin: `*`, all methods, all headers) — configured in `main.ts`
- **TypeScript config**: `noImplicitAny: false`, `strictNullChecks: true`, module: `nodenext`
- **Dockerfile**: Two-stage build (development → production), Alpine-based, Node 20, port 3000
- **No guards/middleware/interceptors**: Simple pass-through architecture. All logic in AppService.

## Changes from main (Migration History)

이 브랜치(`claude/bold-cerf`)에서 main 대비 수행된 주요 변경사항:

### 1. OpenAPI Contract 기반 아키텍처로 전환
- **Before (main)**: `AppService`에서 직접 `fetch()`로 idv-server API를 호출. URL/헤더/body를 수동 구성.
- **After**: OpenAPI Generator로 생성된 `DefaultApi` 클라이언트를 사용하는 `IdvServerClient` 도입. 타입 안전한 API 호출.

### 2. API 라우트 체계 변경
- **Before (main)**: `GET /access_token_sdk`, `GET /us/start`, `GET /us/kyc/get`, `GET /jp/start`, `GET /jp/kyc/get`, `GET /start` — Query parameter 기반, v1 prefix 없음
- **After**: 모든 엔드포인트가 `POST /v1/idv/...` 패턴으로 통일. JSON body 기반. 총 30+ 엔드포인트.

### 3. 국가별 엔드포인트 대폭 확장
- **Before (main)**: US(start, kyc/get), JP(start, kyc/get), Generic(start) — 6개 엔드포인트
- **After**: US/UK/CA(Plaid), JP(Liquid), CN(Tencent) + Generic — 30+ 엔드포인트 (start, kyc/get, kyc/put, cookie/start, health, session token, notification, mock, login-ticket)

### 4. DI 구조 변경
- **Before (main)**: `AppModule { providers: [AppService, StateService] }` — AppService가 직접 fetch
- **After**: `AppModule { providers: [IdvServerClient, AppService, StateService] }` — IdvServerClient가 HTTP 클라이언트 역할 분리

### 5. 에러 포워딩 개선
- **Before (main)**: `throw new HttpException(error.message, HttpStatus.BAD_GATEWAY)` — 항상 502, 에러 메시지만 전달
- **After**: `rethrow()`가 `ResponseError`에서 upstream status code와 body를 보존하여 전달

### 6. 새 파일 추가
- `src/sdk/` 디렉토리 전체 (idv-client.ts, api-contract.ts, case-converter.ts, index.ts)
- `src/sdk/generated/` (OpenAPI Generator 산출물)
- `src/idvServer/` (customFetch.ts, idvServerClient.ts 재수출)
- `scripts/copy-openapi-client.mjs`
- `src/app.controller.spec.ts`, `src/sdk/idv-client.integration.spec.ts` (통합 테스트)

### 7. Docker 이미지 버전
- **Before (main)**: `tomoadmin/idv-client-server:0.0.2` (prod), `test-0.0.2.0` (test/dev)
- **After**: 모든 서비스 `test-0.0.2.4`로 통일, prod 서비스 build target이 `development`로 변경됨
