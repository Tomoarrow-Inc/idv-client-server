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
| Old API 엔드포인트 | 지원 (`/v1/verify/session` 등) | 미지원 (레거시) |
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
| POST | `/v1/idv/kyc/get` | KYC 결과 조회 |

### US/UK/CA (Plaid)
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/idv/{country}/start` | IDV 시작 |
| POST | `/v1/idv/{country}/kyc/get` | KYC 조회 |
| POST | `/v1/idv/{country}/kyc/put` | KYC 저장 |
| POST | `/v1/idv/{country}/cookie/start` | 쿠키 기반 IDV 시작 |
| GET | `/v1/idv/{country}/health` | 헬스체크 |

### JP (Liquid)
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/idv/jp/start` | IDV 시작 |
| POST | `/v1/idv/jp/kyc/get` | KYC 조회 |
| POST | `/v1/idv/jp/kyc/put` | KYC 저장 |
| POST | `/v1/idv/jp/cookie/start` | 쿠키 기반 IDV 시작 |
| POST | `/v1/idv/jp/notification` | Liquid 웹훅 |
| GET | `/v1/idv/jp/health` | 헬스체크 |

### CN (Tencent/TomoIdv)
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/idv/cn/start` | IDV 시작 |
| POST | `/v1/idv/cn/token` | CN 전용 토큰 발급 |
| POST | `/v1/idv/cn/kyc/get` | KYC 조회 |
| POST | `/v1/idv/cn/result/web` | 웹 결과 조회 |
| GET | `/v1/idv/cn/health` | 헬스체크 |
| POST | `/v1/idv/cn/mock/*` | 모의 테스트 (start, token, kyc/get) |

### 기타
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/v1/idv/plaid/token/session` | Plaid 세션 토큰 |
| POST | `/v1/idv/liquid/token/session` | Liquid 세션 토큰 |
| POST | `/v1/idv/login-ticket` | 로그인 티켓 교환 |
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
