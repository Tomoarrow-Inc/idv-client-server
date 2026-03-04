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

## 역할 정의 (OIDC Social KYC)

| 컴포넌트 | 역할 | 설명 |
|---|---|---|
| test-board.html | **고객사 Frontend** | end user가 도달하는 고객사 웹 페이지 (시뮬레이션) |
| idv-client-server | **고객사 Backend** | 고객사의 BFF. Tomo API와 통신, OAuth2 인증 처리 |
| idv-server | **Tomo API Server** | KYC 오케스트레이션, ID vendor 연동, 인가 관리 |
| idv-app | **Tomo App (Frontend)** | Tomo 측 UI (인가 승인 페이지 등) |

### OIDC Social KYC 플로우

```
[End User]          [Customer Frontend]    [Customer Backend]       [Tomo API]       [Google]
 (browser)          (test-board.html)      (idv-client-server)     (idv-server)
    │                     │                       │                      │               │
    │ ── A. 사전 인증 ─────────────────────────────────────────────────────────────────────
    │                     │              POST /v1/oauth2/token ─────────►│               │
    │                     │              (client_credentials + JWT)      │               │
    │                     │                       │◄── access_token ─────│               │
    │                     │                       │                      │               │
    │ ── B. Google Sign-In ────────────────────────────────────────────────────────────────
    ├── "Sign in" ──────►│                       │                      │               │
    │                     ├── Google Identity Services ────────────────────────────────►│
    │                     │◄── ID Token (sub, email, name) ────────────────────────────│
    │◄── 사용자 정보 ────│                       │                      │               │
    │                     │                       │                      │               │
    │ ── C. Social KYC 시작 ───────────────────────────────────────────────────────────────
    ├── "인증 시작" ────►│                       │                      │               │
    │                     ├── { customer_id } ──►│                      │               │
    │                     │              POST /v1/idv/start ────────────►│               │
    │                     │              { user_id: <customer_id>,       │               │
    │                     │                email: <google_email>,        │               │
    │                     │                login_hint: <google_email>,   │               │
    │                     │                callback_url: <test-board>,   │               │
    │                     │                provider: "google" }          │               │
    │                     │                       │◄── { start_idv_uri } │               │
    │                     │◄── start_idv_uri ─────│                      │               │
    │◄── "인가 승인" 버튼│                       │                      │               │
    │                     │                       │                      │               │
    │ ── D. 인가 승인 ────────────────────────────────────────────────────────────────────
    ├── start_idv_uri 방문 ──────────────────────────────────────────►│               │
    │   (Tomo 인가 페이지: "KYC 인증을 승인하시겠습니까?")              │               │
    │── 승인 ────────────────────────────────────────────────────────►│               │
    │                     │                       │◄── redirect ─────────│               │
    │                     │                       │  (callback_url)      │               │
    │                     │                       │                      │               │
    │ ── E. KYC 결과 조회 ────────────────────────────────────────────────────────────────
    │                     │              POST /v1/idv/kyc/get ─────────►│               │
    │                     │              { user_id: <customer_id>,       │               │
    │                     │                country: "us" }               │               │
    │                     │                       │◄── { country,        │               │
    │                     │                       │     full_name,       │               │
    │                     │                       │     date_of_birth,   │               │
    │                     │                       │     full_address }   │               │
    │                     │◄── KYC 결과 ──────────│                      │               │
    │◄── 결과 표시 ──────│                       │                      │               │
```

**핵심 포인트:**
- user_id는 **고객사의 내부 사용자 식별자**이다 (Google sub이 아님)
- Google subject_id(sub)는 **idv-server가 OAuth callback에서 직접 추출**한다 — 고객사가 전달하지 않음
- Step D의 `start_idv_uri`는 **Tomo의 인가 페이지** (Google Login 아님)
- end user는 Google Login을 **한 번만** 한다 (고객사 Frontend에서)
- Tomo API는 고객사가 client_credentials로 인증된 상태이므로, 고객사가 제출한 user_id를 신뢰한다

### Test Board

`/test-board` — 고객사 Frontend를 시뮬레이션하는 인터랙티브 테스트 페이지. Google Sign-In → Token → Start Social KYC → Authorization → KYC Status 플로우를 브라우저에서 테스트할 수 있다.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7 (target ES2023, module: nodenext)
- **Package Manager**: pnpm (NOT npm)
- **Runtime**: Node.js 20
- **Testing**: Jest 30 + Supertest

## Build & Run

**로컬에 pnpm이 설치되어 있지 않으므로, 모든 pnpm 명령은 Docker 환경에서 실행한다.**

```bash
# Docker를 통한 pnpm 명령 실행 (로컬에 pnpm 미설치)
docker run --rm -v "$(pwd)":/app -w /app node:20-alpine sh -c "npm install -g pnpm && pnpm <command>"

# Docker Compose 빌드 및 실행
docker compose build client-server          # 이미지 빌드
docker compose up client-server-test -d     # test 환경 실행 (port 8080)
docker compose up client-server-dev -d      # dev 환경 실행 (port 8081)

# 테스트 실행 (Docker 내부)
docker run --rm -v "$(pwd)":/app -w /app node:20-alpine sh -c "npm install -g pnpm && pnpm install && pnpm test"

# pnpm 명령 참고 (Docker 내에서 실행)
pnpm install
pnpm start:dev              # Watch mode with hot reload
pnpm start:debug            # Debug + watch mode
pnpm build                  # nest build
pnpm start:prod             # Run compiled output (node dist/main)
pnpm test                   # Unit tests (Jest)
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report
pnpm test:e2e               # End-to-end tests
pnpm lint                   # ESLint with auto-fix
pnpm format                 # Prettier (src + test)
pnpm gen                    # Orval + openapi-generator-cli (runs from ci/contracts/)
pnpm sync-client            # Copy generated client from ci/ to src/sdk/generated/
pnpm sync-swagger           # Copy OpenAPI spec from ci/ to src/swagger/
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
  main.ts              — Bootstrap NestJS app, CORS enabled (origin: *), Swagger UI at /api-docs
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

  swagger/
    client-server.openapi.json — OpenAPI spec for Swagger UI (copied from ci/contracts/openapi/)
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

### Swagger UI Test Board
- `GET /api-docs` → Swagger UI (브라우저에서 모든 엔드포인트 테스트 가능)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `IDV_BASE_URL` | Yes | Base URL for idv-server (default: `http://idv-server-ghci`) |
| `TOMO_IDV_CLIENT_ID` | Yes | OAuth2 client ID for JWT assertion |
| `TOMO_IDV_SECRET` | Yes | Base64url-encoded EC P-256 JWK private key |
| `PORT` | No | Server port (default: 3000, mapped to 4300 in docker-compose) |
| `RUN_IDV_INTEGRATION_TESTS` | No | Set to `true` to run OAuth2 integration tests |
| `AS_SIGNING_JWK` | No | AS public JWK for verifying access tokens in tests |
| `GOOGLE_CLIENT_ID` | Yes (test board) | Google Cloud OAuth 2.0 Client ID for test-board Google Sign-In |

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

## Teams 액션 가이드

master agent가 Teams를 통해 작업을 위임할 때 적용되는 프로토콜.

### 작업 수신

1. **TaskGet**으로 할당된 task의 description 확인
2. `agent/share/idv-client-server/`에 참고 문서가 있으면 읽기
3. **TaskUpdate**: status → `in_progress`

### 작업 중

- 차단 요인·질문 → **SendMessage**로 master에게 전달
- 주요 이정표 → SendMessage로 상태 공유 (선택)

### 작업 완료

1. **TaskUpdate**: status → `completed`
2. **SendMessage**: master에게 완료 요약 (변경 파일, 빌드/테스트 결과, 후속 작업)
3. **TaskList**: 다음 task 확인 → 있으면 수행

### 작업 실패

1. **TaskUpdate**: status를 `in_progress` 유지 (completed 금지)
2. **SendMessage**: 실패 원인·차단 요인을 master에게 전달

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
