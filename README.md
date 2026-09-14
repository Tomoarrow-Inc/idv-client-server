# idv-client-server

Tomo Identity Verification (IDV) **BFF (Backend For Frontend)** 모듈.

idv-client(React SPA)와 idv-server(Haskell) 사이에서 OAuth2 인증과 API 프록시 역할을 수행합니다. TypeScript(NestJS)와 Kotlin(Spring Boot) 두 가지 구현을 제공하며, 동일한 test-board 프론트엔드를 공유합니다.

## 프로젝트 구조

```
idv-client-server/
├── typescript/              ← NestJS 11 BFF (TypeScript)
│   ├── src/                 ← 소스 코드
│   ├── scripts/             ← OpenAPI 클라이언트 복사 스크립트
│   ├── Dockerfile
│   ├── docker-compose.yaml  ← TypeScript 단독 환경별 배포용
│   └── package.json
├── kotlin/                  ← Spring Boot 3.4 BFF (Kotlin)
│   ├── src/main/kotlin/     ← 소스 코드
│   ├── src/main/resources/  ← application.yml
│   ├── build.gradle.kts
│   ├── Dockerfile
│   └── docker-compose.yaml  ← Kotlin 단독 배포용
├── test-board/              ← 공통 프론트엔드 (고객사 시뮬레이션)
│   └── test-board.html
├── docker-compose.yaml      ← 통합 오케스트레이션 (TypeScript + Kotlin 동시)
├── .gitignore
├── CLAUDE.md
└── README.md
```

## 아키텍처

```
[End User / Browser]
       │
       ├──── http://localhost:4300 ──→ [TypeScript BFF (NestJS)]  ──→ [idv-server]
       │                                       │
       │                              test-board/test-board.html
       │                                       │
       └──── http://localhost:4301 ──→ [Kotlin BFF (Spring Boot)] ──→ [idv-server]
```

- 두 BFF 모두 동일한 idv-server API를 프록시
- 동일한 `test-board.html`을 서빙 (상대 URL 사용 → 어느 백엔드에서든 동작)
- 동일한 엔드포인트 패턴 (`POST /v1/idv/...`, `GET /v1/idv/{country}/health`)

## 빠른 시작 (Docker Compose)

### 전제조건

- Docker + Docker Compose v2.17+
- `typescript/.env` 파일 (환경 변수 섹션 참고)
- `kotlin/.env` 파일 (`.env.example` 복사 후 작성)

### 양쪽 서버 동시 실행 (idv-client-server 루트에서)

```bash
cd idv-client-server

# 빌드 + 실행
docker compose up -d

# 상태 확인
docker compose ps

# 로그 확인
docker compose logs -f typescript
docker compose logs -f kotlin

# 종료
docker compose down
```

| 서비스 | 포트 | URL |
|---|---|---|
| TypeScript BFF | `4300` | http://localhost:4300 |
| Kotlin BFF | `4301` | http://localhost:4301 |

### Test Board 접속

- TypeScript: http://localhost:4300/test-board
- Kotlin: http://localhost:4301/test-board
- API Docs (TypeScript only): http://localhost:4300/api-docs

## API 계약 버전 (Tomo-API-Version)

idv-server 는 25개 SDK operation 전부에서 `Tomo-API-Version` 요청 header 로
응답 계약을 고른다 (`idv-server/lib/App/Contract/Version.hs`).

### 서버가 받아주는 값

| 요청 header | 적용 계약 | 결과 |
|---|---|---|
| **보내지 않음** | **1.3** (고정 v1.3.20) | 200. `/v1/idv/result` 응답에만 `Tomo-API-Version: 1.3` 이 붙고 나머지 24개에는 붙지 않는다 |
| `1.4` | 1.4 | 200. 25개 전부 `Tomo-API-Version: 1.4` 응답 header |
| `1.3`, `1.3.20`, `1.4.0`, `latest`, 빈 값, 중복 | 선택 없음 | 400 `{"error":"unsupported_api_version", ...}`. 업무 로직 실행 전에 거부된다 |

**계약 1.3 의 wire 표현은 "header 를 보내지 않는 것"이다.**
`Tomo-API-Version: 1.3` 은 1.3 선택이 아니라 거부 대상이다.

`/v1/idv/result` 응답 형태만 실제로 달라진다.

```jsonc
// 1.3
{ "result": { "auth_id": "...", "policy_key": "...", "country": "us", "result": { ... } } }

// 1.4 — 최상위 user_id 와 record 의 표준 kyc 가 추가된다
{ "user_id": "ppid...", "result": { "auth_id": "...", "policy_key": "...", "country": "us",
                                    "result": { ... }, "kyc": { ... } } }
```

### 두 계약 체제

SDK 계약(`ci/contracts/openapi/sdk.openapi.json`, info.version 1.4.0)은 **1.4
계약이다.** 25개 operation 전부에 `Tomo-API-Version` 을 `required` + `enum
["1.4"]` 로 요구한다. 계약 1.3 은 이 계약의 범위 밖이고, 그 계약은 따로 있다.

| 계약 | 파일 | wire 표현 |
|---|---|---|
| 1.4 | `ci/contracts/openapi/sdk.openapi.json` | `Tomo-API-Version: 1.4` 필수 |
| 1.3 | `ci/contracts/openapi/v1.3.20/sdk.openapi.json` | header 없음 (스펙에 header 개념 자체가 없음) |

그래서 **런타임은 header 부재를 허용하는데 SDK 계약은 required 로 선언**하는
비대칭이 생긴다. 이건 버그가 아니라 범위 설정이다. 계약을 optional 로 바꾸면
200 응답 선언이 여전히 1.4 단독이라 "생략 가능한데 그때 응답이 뭔지는 안
알려주는" 더 부정확한 계약이 된다.

생성 SDK 는 그래서 1.4 전용이다. 25개 method 전부가 `Tomo_API_Version` 을
required 로 요구하고 없으면 `RequiredError` 를 던진다. BFF 는 그 요구를
`SDK_VERSION_PARAM` 으로 만족시킨 뒤, 계약 1.3 선택일 때 `contractInit` 에서
header 를 다시 떼어낸다. `app.service.ts` 의 그 한 곳이 SDK 타입과 실제 wire 가
갈라지는 유일한 지점이다.

### 버전 신호 해석

응답 header 두 개로 어떤 계약이 적용됐는지 판단한다.

| 응답 `Tomo-API-Version` | 응답 `Vary` | 의미 |
|---|---|---|
| `1.4` | 있음 | 계약 1.4 적용 |
| `1.3` | 있음 | 계약 1.3 적용 (`/v1/idv/result` 전용) |
| 없음 | **있음** | **계약 1.3 적용** — 게이트는 돌았다. `/v1/idv/result` 를 뺀 24개의 정상 상태 |
| 없음 | 없음 | 게이트 미작동 의심 — 25개 밖 경로이거나 배선 문제 |
| 없음 | 있음 + 400 | 협상 실패. 계약이 선택되지 않았다 |

계약 1.3 에서 서버는 `/v1/idv/result` 에만 버전 응답 header 를 붙인다. 나머지
24개에서는 `Vary: Tomo-API-Version` 이 "게이트가 실제로 돌았다" 를 알려주는
유일한 신호이므로, BFF 가 이를 그대로 전달한다.

### 응답 status 는 upstream 것을 그대로 쓴다

Nest 의 POST 기본 status 는 201 이다. `forward()` 가 upstream status 를
`res.status()` 로 적용하므로 idv-server 의 200 이 그대로 나간다. 개별 라우트에
`@HttpCode` 를 붙이지 않는다 — status 소유권은 `forward()` 한 곳에 있다.

### 계약 1.3 응답 통과 검증

`typescript/test/fixtures/idv-result/v1.3.20/` 에 idv-server 의 독립 golden
8개가 있고, `src/legacy-result-passthrough.spec.ts` 가 생성 SDK 의
`Configuration.fetchApi` 주입점으로 전송만 가로채 **실제 코드 경로 전체**를
태워 검증한다. `/v1/idv/result` 를 `.value()` 로 되돌리면 즉시 깨진다 —
재생성된 `ResultRes` 는 1.4 전용 oneOf 라 1.3 body 를 `{}` 로 만든다.

### BFF 동작 — 투명 전달

- 호출자가 `Tomo-API-Version` 을 보내면 **검증 없이 그대로 전달**한다. BFF 가
  미리 거르면 호출자가 서버의 실제 400 을 볼 수 없다.
- 호출자가 안 보내면 **BFF 도 안 보낸다** = 계약 1.3. 계약 선택권은 호출자에게
  있고, BFF 가 기본값을 주입하면 호출자 모르게 응답 형태가 바뀐다.
- idv-server 가 적용한 버전을 응답 `Tomo-API-Version` header 로 에코한다.
  계약 1.3 에서 값이 없는 것은 정상이다.

생성 SDK 는 25개 method 전부에서 `Tomo_API_Version` 을 `required` +
`enum ["1.4"]` 로 요구하고 없으면 `RequiredError` 를 던진다. 즉 **생성 client
자체로는 1.3 호출을 표현할 수 없다.** BFF 는 그 요구를 `SDK_VERSION_PARAM`
으로 만족시킨 뒤, 1.3 선택일 때 `contractInit` 에서 header 를 다시 떼어낸다.
`app.service.ts` 의 그 한 곳이 SDK 타입과 실제 wire 가 갈라지는 유일한 지점이다.

### test-board 사용법

좌측 Quick Jump 사이드바 아래 **API VERSION** 에서 고른다.

| 버튼 | 보내는 것 | 적용 계약 |
|---|---|---|
| `1.3` (기본) | 아무것도 안 보냄 | 1.3 — 기존 고객사가 지금 받는 응답 |
| `1.4` | `Tomo-API-Version: 1.4` | 1.4 |

응답 패널 상단 표시줄이 세 칸이다 — 요청 버전 / 응답 버전 / **버전 게이트**.
세 번째 칸이 "계약 1.3 적용됨" 과 "게이트 미작동" 을 가른다(위 신호 해석표).

선택은 `localStorage` 에 저장되고 25개 endpoint 전체에 적용된다(토큰 발급 포함).
게이트 대상이 아닌 `/v1/verify/session` 에는 보내지 않는다. 응답 패널 상단에
요청/응답 버전이 나란히 표시된다.

계약 버전이 늘어나면 `test-board/test-board.html` 의 `CONTRACT_VERSIONS` 배열에
항목 한 줄만 추가하면 버튼이 늘어난다.

### Result delete 카드

API Tests 섹션 1-4 / 1-5 가 `POST /v1/idv/result/delete` 와
`POST /v1/idv/result/bulk-delete` 다. 저장된 KYC 결과를 **되돌릴 수 없게**
삭제하므로 기본 body 를 자동 생성하지 않는다. 0번에서 Access Token 을 발급한 뒤
`<ppid_token 기입>` 자리에 실제 ppid 를 붙여넣고 Send 한다.
응답 `status` 는 `deleted` 또는 `not_deletable` 이다.

### superproject 루트에서 실행 (dcp 사용)

```bash
cd identity-verification
source ./dcp

# idv-server + TypeScript BFF + Kotlin BFF + 프론트엔드 전체 기동
dcp local up -d

# 또는 ghci 모드 (idv-server 인터랙티브)
dcp ghci up -d
```

| 서비스 | 포트 | IDV_BASE_URL |
|---|---|---|
| idv-server | :80 | — |
| TypeScript BFF | :4300 | `http://idv-server` |
| Kotlin BFF | :4301 | `http://idv-server-ghci` |

## TypeScript BFF (NestJS)

### 기술 스택

- NestJS 11 + TypeScript 5.7
- pnpm (패키지 매니저 — npm 사용 금지)
- Node.js 20 (Docker Alpine)
- Jest 30 + Supertest

### 로컬 실행 (Docker 없이)

```bash
cd typescript

# 의존성 설치 (pnpm 필수)
pnpm install

# 개발 모드 (watch + hot reload)
pnpm start:dev

# 프로덕션 빌드 + 실행
pnpm build
pnpm start:prod
```

> 로컬에 pnpm이 없는 경우 Docker로 실행:
> ```bash
> docker run --rm -v "$(pwd)":/app -w /app node:20-alpine sh -c "npm install -g pnpm && pnpm install && pnpm start:dev"
> ```

### Docker 단독 실행

```bash
cd typescript

# 환경별 실행 (docker-compose.yaml)
docker compose up client-server-test -d   # test (port 8080, test.tomopayment.com)
docker compose up client-server-dev -d    # dev  (port 8081, dev.tomopayment.com)
docker compose up client-server-prod -d   # prod (port 80,   api.tomopayment.com)
```

### API 클라이언트 재생성

OpenAPI spec 변경 시 클라이언트를 재생성해야 합니다:

```bash
cd typescript

# ci 디렉터리 orval 실행 후 복사
pnpm sync-client    # ci/에서 생성된 클라이언트를 src/sdk/generated/로 복사
pnpm sync-swagger   # OpenAPI spec을 src/swagger/로 복사
```

생성된 파일: `typescript/src/sdk/generated/` (수동 편집 금지)

### 소스 구조

```
typescript/src/
  main.ts              — NestJS 부트스트랩, CORS 전체 허용, Swagger UI, test-board 라우팅
  app.module.ts        — 루트 모듈
  app.controller.ts    — 모든 HTTP 라우트 (30+ 엔드포인트)
  app.service.ts       — 비즈니스 로직 (IdvServerClient 호출)
  state.service.ts     — 인메모리 상태 관리 (토큰 저장)
  sdk/
    idv-client.ts      — IdvServerClient (Generated DefaultApi 래퍼, body 변형 금지)
    tomo-idv-node.ts   — OAuth2 JWT 어설션 생성 (ES256/P-256)
    api-contract.ts    — 요청 바디 타입 정의 (snake_case)
    generated/         — OpenAPI Generator 산출물 (수동 편집 금지)

  swagger/
    client-server.openapi.json — Swagger UI용 스펙
```

### 테스트

```bash
cd typescript

pnpm test                   # 단위 테스트
pnpm test:e2e               # E2E 테스트 (idv-server 필요)
pnpm test:cov               # 커버리지 리포트
```

통합 테스트는 `RUN_IDV_INTEGRATION_TESTS=true` 설정 필요.

## Kotlin BFF (Spring Boot)

### 기술 스택

- Spring Boot 3.4.4 + Kotlin 2.1.20
- JDK 21 (Eclipse Temurin)
- Gradle 8.14 (Kotlin DSL)
- tomo-idv-client-kotlin SDK (DefaultApi)
- nimbus-jose-jwt (ES256 JWT client assertion)

### 전제조건: SDK 빌드

Kotlin BFF는 `tomo-idv-client-kotlin` SDK에 의존합니다. 로컬 실행 전 mavenLocal에 퍼블리시해야 합니다:

```bash
cd ../tomo-idv-client-kotlin
./gradlew publishToMavenLocal
```

Docker 빌드 시에는 Dockerfile이 자동으로 SDK를 빌드합니다 (별도 작업 불필요).

### 로컬 실행 (Docker 없이)

```bash
cd kotlin

# 빌드
./gradlew bootJar

# 실행
java -jar build/libs/idv-bff-kotlin-0.0.1-SNAPSHOT.jar

# 또는 Gradle로 직접 실행
./gradlew bootRun
```

### Docker 단독 실행

```bash
cd kotlin

docker compose up bff-kotlin -d   # port 4301
```

### 소스 구조

```
kotlin/src/main/kotlin/com/tomoarrow/idv/bff/
  Application.kt              — Spring Boot 엔트리포인트
  GlobalExceptionHandler.kt   — SDK 예외 → HTTP 에러 투명 전달

  config/
    AppProperties.kt          — 환경 변수 바인딩 (@ConfigurationProperties)
    ApiClientConfig.kt        — DefaultApi Bean 생성
    CorsConfig.kt             — CORS 전면 개방 (origin: *)

  auth/
    JwtAssertionBuilder.kt    — ES256 JWT client assertion 생성 (nimbus-jose-jwt)

  service/
    StateService.kt           — 인메모리 ConcurrentHashMap (access_token 저장)
    TokenService.kt           — OAuth2 토큰 발급 (DefaultApi 호출)
    IdvService.kt             — DefaultApi 메서드 래핑 (모든 IDV 엔드포인트)

  controller/
    OAuthController.kt        — POST /v1/oauth2/token
    IdvController.kt          — 모든 IDV 엔드포인트 (US/UK/CA/JP/CN + 세션 + 로그인)
    TestBoardController.kt    — GET /test-board, GET /test-board/config
```

### TypeScript BFF와의 차이점

| 항목 | TypeScript | Kotlin |
|---|---|---|
| 구버전 엔드포인트 | 미지원 | 미지원 |
| Swagger UI | 지원 (`/api-docs`) | 미지원 |
| 직렬화 전략 | idv-server wire format 보존 | idv-server wire format 보존 |
| SDK 호출 | Generated TypeScript fetch | Kotlin suspend fun + runBlocking |

## 공통 API 엔드포인트

양쪽 BFF 모두 아래 엔드포인트를 동일하게 구현합니다.

### OAuth2
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/oauth2/token` | 액세스 토큰 발급 (client_credentials + JWT assertion) |

### Generic (국가 무관)
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/idv/start` | IDV 시작 (country 필드로 분기) |
| POST | `/v1/idv/result` | KYC 결과 조회 |

### 기타
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/test-board` | Test Board HTML |
| GET | `/test-board/config` | Test Board 설정 JSON |

## 환경 변수

양쪽 BFF가 공통으로 사용하는 환경 변수:

| 변수 | 필수 | 설명 | 기본값 |
|---|---|---|---|
| `IDV_BASE_URL` | O | idv-server URL | `http://localhost` |
| `TOMO_IDV_CLIENT_ID` | O | OAuth2 클라이언트 ID | — |
| `TOMO_IDV_SECRET` | O | Base64url EC P-256 JWK 개인 키 | — |
| `IDV_APP_URL` | △ | idv-app URL (test-board 설정) | — |
| `TEST_BOARD_PATH` | X | test-board.html 절대 경로 | 자동 설정 |
| `PORT` | X | 서버 포트 (TypeScript만) | `3000` |

## Docker 빌드 상세

### 의존성 해결

양쪽 Dockerfile 모두 Docker Compose `additional_contexts`를 통해 외부 의존성을 해결합니다:

```yaml
# docker-compose.yaml
services:
  typescript:
    build:
      additional_contexts:
        tomo-idv-client-node: ../tomo-idv-client-node    # npm 패키지 (file: 의존성)

  kotlin:
    build:
      additional_contexts:
        tomo-idv-client-kotlin: ../tomo-idv-client-kotlin  # Kotlin SDK (mavenLocal)
```

- **TypeScript**: `tomo-idv-client-node`을 `/deps/`에 복사 후 `file:` 경로를 `sed`로 치환
- **Kotlin**: 3-stage 빌드 — SDK `publishToMavenLocal` → BFF `bootJar` → JRE 런타임

### 단독 빌드 (docker compose 없이)

```bash
# TypeScript (idv-client-server 루트에서)
docker build -f typescript/Dockerfile \
  --build-context tomo-idv-client-node=../tomo-idv-client-node \
  --target development -t idv-bff-ts .

# Kotlin (idv-client-server 루트에서)
docker build -f kotlin/Dockerfile \
  --build-context tomo-idv-client-kotlin=../tomo-idv-client-kotlin \
  -t idv-bff-kotlin .
```

## Health Check

두 서버 모두 국가별 헬스체크 엔드포인트를 제공합니다. 이 엔드포인트는 idv-server로 프록시되므로, idv-server가 실행 중이어야 정상 응답을 받습니다.

```bash
# TypeScript
curl http://localhost:4300/v1/idv/us/health
curl http://localhost:4300/v1/idv/jp/health
curl http://localhost:4300/v1/idv/cn/health

# Kotlin
curl http://localhost:4301/v1/idv/us/health
curl http://localhost:4301/v1/idv/jp/health
curl http://localhost:4301/v1/idv/cn/health

# 서버 자체 생존 확인 (idv-server 불필요)
curl http://localhost:4300/test-board/config   # TypeScript → 200 JSON
curl http://localhost:4301/test-board/config   # Kotlin → 200 JSON
```

| 응답 코드 | 의미 |
|---|---|
| 200 | idv-server 정상 |
| 502 | idv-server 미응답 (BFF는 정상 동작 중) |
| Connection refused | BFF 자체가 미실행 |
