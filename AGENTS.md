# idv-client-server

Backend For Frontend (BFF) server for idv-client. Handles OAuth2 client-assertion flow and proxies requests to idv-server (Haskell backend).

## 프로젝트 목적

이 프로젝트는 idv-server API가 클라이언트에게 배포됐을 때 **클라이언트 측 기능을 시뮬레이션**하는 모듈이다.

### 핵심 원칙

1. **투명한 메시지 전달**: 클라이언트가 idv-server로부터 받는 응답 메시지, error body, `message` 필드, 문구, 언어를 변환·정규화·번역·감싸기 없이 그대로 전달해야 한다.
2. **투명한 요청 전달**: frontend가 idv-server에 보내는 request body는 필드명 변경, 값 변경, 필드 추가/삭제 없이 그대로 전달해야 한다. per-country endpoint를 generic endpoint로 바꾸면서 `country`를 body에 주입하는 방식은 금지한다.
3. **투명한 에러 전달**: idv-server로부터 받는 에러 정보(HTTP status code, content-type, error body)를 그대로 클라이언트에 전달해야 한다.
4. **Generated 코드 수정 금지**: OpenAPI generated 코드는 절대 직접 수정하지 않는다. 문제가 있으면 idv-server contract를 수정하고 contract generation 파이프라인으로만 갱신한다.
5. **자동 서버 인증**: 클라이언트측 OAuth2 인증(client_credentials + JWT assertion)을 자동으로 처리한다. 엔드유저들은 인증 과정을 의식하지 않고 이 서버를 통해 idv-server API에 접근한다.

### 설계 귀결

- Generated OpenAPI 클라이언트는 `modelPropertyNaming=original,paramNaming=original` 설정으로 스펙의 필드명을 그대로 유지한다.
- BFF는 transparent proxy로 동작하며 request body를 변환 없이 idv-server에 전달한다.
- 에러 응답은 upstream status, content-type, body를 그대로 보존한다. 메시지 문자열을 새로 만들거나 바꾸지 않는다.

## 역할 정의

| 컴포넌트 | 역할 | 설명 |
|---|---|---|
| test-board.html | **고객사 Frontend** | end user가 도달하는 고객사 웹 페이지 (시뮬레이션) |
| idv-client-server | **고객사 Backend** | 고객사의 BFF. Tomo API와 통신, OAuth2 인증 처리 |
| idv-server | **Tomo API Server** | KYC 오케스트레이션, ID vendor 연동, 인가 관리 |
| idv-app | **Tomo App (Frontend)** | Tomo 측 UI (인가 승인 페이지 등) |

### Custom KYC 플로우

idv-client-server는 고객사 BFF 시뮬레이터로서 OAuth2 client_credentials 인증과 Authorization header 부착만 담당한다. `/v1/idv/start`, `/v1/idv/{country}/start`, `/v1/idv/kyc/get` 등 IDV request body는 test-board 또는 클라이언트가 보낸 값을 그대로 idv-server에 전달한다.

**핵심 포인트:**
- user_id는 **고객사의 내부 사용자 식별자**이다.
- idv-client-server는 request body의 필드를 보정하거나 기본값을 주입하지 않는다.
- idv-app은 idv-server가 반환한 `start_idv_uri` 이후의 사용자 입력 및 인가 화면을 담당한다.
- Tomo API는 고객사가 client_credentials로 인증된 상태이므로, 고객사가 제출한 user_id를 신뢰한다.

### Test Board

`/test-board` — 고객사 Frontend를 시뮬레이션하는 인터랙티브 Custom KYC 테스트 페이지. Token 발급 후 IDV API request body가 그대로 전달되는지 브라우저에서 테스트할 수 있다.

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
    ↓ HTTP (JSON body)
AppController (NestJS, src/app.controller.ts)
    ↓ delegates without body mutation
AppService (src/app.service.ts)
    ↓ transparent proxy / generated OpenAPI client
idv-server (Haskell backend)
```

### Key Design Patterns

- **Wire Format Preservation**: BFF must not rename, add, remove, or rewrite request body fields. Incoming frontend body is forwarded to the same idv-server endpoint path as-is, except for BFF-owned authentication headers.
- **Auth Flow**: OAuth2 `client_credentials` grant with `private_key_jwt` (ES256/P-256). The BFF creates a JWT client assertion using `tomo-idv-node.ts`, exchanges it for an access token via `/v1/oauth2/token`, and stores the token in `StateService` (in-memory singleton).
- **Token Management**: Access token is stored in `StateService` under key `access_token`. Most IDV endpoints require `this.requireAccessToken()` which reads from state. Token must be obtained first via `POST /v1/oauth2/token`.
- **Error Forwarding**: upstream status code, content-type, and body are forwarded without message rewriting.

## Source Structure (Detailed)

```
src/
  main.ts              — Bootstrap NestJS app, CORS enabled (origin: *), Swagger UI at /api-docs
  app.module.ts         — Root module: providers = [IdvServerClient, AppService, StateService]
  app.controller.ts     — All HTTP routes, delegates to AppService, forwards upstream errors without rewriting
  app.service.ts        — Business logic, uses IdvServerClient + StateService
  state.service.ts      — In-memory singleton Map<string,any> with pub/sub, backup/restore
  app.controller.spec.ts — Integration test for OAuth2 flow (skipped unless RUN_IDV_INTEGRATION_TESTS=true)

  idvServer/
    idvServerClient.ts  — Re-exports IdvServerClient from sdk/
    customFetch.ts       — Custom fetch wrapper (resolves IDV_BASE_URL, error shaping) — currently unused by main flow

  sdk/
    index.ts            — Barrel: exports IdvServerClient, body types, response types, enums, auth utils
    idv-client.ts       — IdvServerClient class wrapping generated DefaultApi without body mutation
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
- **Wire format**: Controller receives/returns idv-server wire JSON without message or body mutation.
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
- **After**: upstream error forwarding preserves status code, content-type, and body without rewriting messages

### 6. 새 파일 추가
- `src/sdk/` 디렉토리 전체 (idv-client.ts, api-contract.ts, case-converter.ts, index.ts)
- `src/sdk/generated/` (OpenAPI Generator 산출물)
- `src/idvServer/` (customFetch.ts, idvServerClient.ts 재수출)
- `scripts/copy-openapi-client.mjs`
- `src/app.controller.spec.ts`, `src/sdk/idv-client.integration.spec.ts` (통합 테스트)

### 7. Docker 이미지 버전
- **Before (main)**: `tomoadmin/idv-client-server:0.0.2` (prod), `test-0.0.2.0` (test/dev)
- **After**: 모든 서비스 `test-0.0.2.4`로 통일, prod 서비스 build target이 `development`로 변경됨

## Agent 워크트리 원칙

이 서브모듈에서 작업하는 agent는 반드시 워크트리(격리된 작업 공간)에서 실행된다.

- `dev`, `main` 등 보호 브랜치에서 직접 작업하지 않는다
- 워크트리 내에서 새 브랜치를 생성하여 커밋한다
- 변경 사항의 대상 브랜치 머지는 사용자의 명시적 명령으로만 수행된다
