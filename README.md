# idv-client-server

Tomo Identity Verification (IDV) **BFF (Backend For Frontend)** 서버.

idv-client(React SPA)와 idv-server(Haskell) 사이에서 OAuth2 인증과 API 프록시 역할을 수행합니다.

## 아키텍처

```
idv-client (React SPA)
    ↓ HTTP POST (snake_case JSON body)
idv-client-server (NestJS BFF) ← 이 프로젝트
    ↓ HTTP POST (camelCase, OpenAPI Generated Client)
idv-server (Haskell backend)
```

- OpenAPI spec 기반으로 생성된 TypeScript 클라이언트(`src/sdk/generated/`)를 통해 idv-server와 통신
- OAuth2 `client_credentials` + `private_key_jwt` (ES256/P-256) 인증 흐름 처리
- 5개국 IDV 지원: US/UK/CA (Plaid), JP (Liquid), CN (Tencent/TomoIdv)

## 기술 스택

- **NestJS 11** + TypeScript 5.7
- **pnpm** (패키지 매니저 — npm 사용 금지)
- **Node.js 20** (Docker Alpine)
- **Jest 30** + Supertest (테스팅)

## 설치 및 실행

```bash
$ pnpm install

# 개발 모드 (watch)
$ pnpm run start:dev

# 프로덕션 빌드 및 실행
$ pnpm run build
$ pnpm run start:prod
```

## API 클라이언트 생성

OpenAPI spec이 변경되면 클라이언트를 재생성해야 합니다:

```bash
# ci 디렉터리에서 생성 후 복사
$ pnpm gen
$ pnpm sync-client
```

생성된 파일은 `src/sdk/generated/`에 위치하며, 직접 수정하면 안 됩니다.

## 주요 엔드포인트

모든 엔드포인트는 `POST /v1/idv/...` 패턴 (health 제외).

| 카테고리 | 엔드포인트 | 설명 |
|----------|-----------|------|
| OAuth2 | `POST /v1/oauth2/token` | 액세스 토큰 발급 (client_credentials) |
| Generic | `POST /v1/idv/start` | 공통 IDV 시작 (country 필드로 분기) |
| Generic | `POST /v1/idv/kyc/get` | 공통 KYC 결과 조회 |
| US/UK/CA | `POST /v1/idv/{country}/start` | 국가별 IDV 시작 |
| US/UK/CA | `POST /v1/idv/{country}/kyc/get` | 국가별 KYC 조회 |
| US/UK/CA | `POST /v1/idv/{country}/kyc/put` | 국가별 KYC 저장 |
| US/UK/CA | `POST /v1/idv/{country}/cookie/start` | 쿠키 기반 IDV 시작 |
| JP | `POST /v1/idv/jp/notification` | Liquid 웹훅 알림 |
| CN | `POST /v1/idv/cn/token` | CN 전용 토큰 발급 |
| CN | `POST /v1/idv/cn/result/web` | CN 웹 결과 조회 |
| CN Mock | `POST /v1/idv/cn/mock/*` | CN 모의 테스트 |
| Session | `POST /v1/idv/plaid/token/session` | Plaid 세션 토큰 |
| Session | `POST /v1/idv/liquid/token/session` | Liquid 세션 토큰 |
| Login | `POST /v1/idv/login-ticket` | 로그인 티켓 교환 |
| Health | `GET /v1/idv/{country}/health` | 국가별 헬스체크 |

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `IDV_BASE_URL` | O | idv-server 기본 URL (기본값: `http://idv-server-ghci`) |
| `TOMO_IDV_CLIENT_ID` | O | OAuth2 클라이언트 ID |
| `TOMO_IDV_SECRET` | O | Base64url 인코딩된 EC P-256 JWK 개인 키 |
| `PORT` | X | 서버 포트 (기본값: 3000) |
| `RUN_IDV_INTEGRATION_TESTS` | X | `true` 설정 시 통합 테스트 실행 |

## Testing

이 프로젝트에는 idv-server와의 실제 통신을 검증하는 **E2E / 통합 테스트**가 포함됩니다. 이제 모든 E2E는 IdvServerClient를 목 처리하지 않고 **실제 idv-server로 HTTP 요청**을 전송합니다.

테스트는 **저장소 루트의 [dcp](../dcp) 스크립트**로 정의된 `dcp ghci`를 사용해 **컨테이너 내부**에서 실행합니다. `dcp ghci run --rm --entrypoint sh idv-client-server -c "{command}"` 형태로 idv-client-server 서비스 컨테이너 안에서 명령을 수행합니다.

### 필수 환경 변수 (실제 idv-server 호출)

`TOMO_IDV_CLIENT_ID`, `TOMO_IDV_SECRET`, `IDV_BASE_URL` 이 설정되어 있어야 합니다. idv-server-ghci를 사용할 때는 `IDV_BASE_URL=http://idv-server-ghci` 를 사용합니다.

### 테스트 종류

| 구분 | 대상 | idv-server 필요 여부 |
|------|------|----------------------|
| 단위 테스트 | `IdvServerClient` 등 일반 단위 | 불필요 (목 사용 가능) |
| E2E 테스트 | HTTP 엔드포인트 — `/v1/oauth2/token`, `/v1/idv/*` | **필수** (실제 호출) |
| 통합 테스트 | `src/sdk/idv-client.integration.spec.ts` — SDK가 idv-server를 직접 호출 | **필수** (`RUN_IDV_INTEGRATION_TESTS=true`) |

### 실행 방법 (dcp — 저장소 루트에서)

```bash
# idv-server-ghci 등 실서버 기동 후 실행

# 1. 단위 테스트 전체
./dcp ghci run --rm --entrypoint sh idv-client-server -c "pnpm run test"

# 2. E2E 테스트 (실제 idv-server 필요)
./dcp ghci run --rm --entrypoint sh idv-client-server -c "TOMO_IDV_CLIENT_ID=... TOMO_IDV_SECRET=... IDV_BASE_URL=http://idv-server-ghci pnpm run test:e2e"

# 3. 통합 테스트 (SDK → idv-server)
./dcp ghci run --rm --entrypoint sh idv-client-server -c "RUN_IDV_INTEGRATION_TESTS=true TOMO_IDV_CLIENT_ID=... TOMO_IDV_SECRET=... IDV_BASE_URL=http://idv-server-ghci pnpm run test -- --testPathPattern=idv-client.integration"
```

### 실행 방법 (로컬 pnpm — idv-client-server 디렉터리에서)

```bash
cd idv-client-server
# idv-server 기동 및 env 설정 후 실행
TOMO_IDV_CLIENT_ID=... TOMO_IDV_SECRET=... IDV_BASE_URL=http://idv-server-ghci pnpm run test:e2e
RUN_IDV_INTEGRATION_TESTS=true TOMO_IDV_CLIENT_ID=... TOMO_IDV_SECRET=... IDV_BASE_URL=http://idv-server-ghci pnpm run test -- --testPathPattern=idv-client.integration
```

### E2E에서 검증하는 엔드포인트 (실제 호출)

- `POST /v1/oauth2/token` — 액세스 토큰 발급
- `POST /v1/idv/us/start` — US IDV 시작
- `POST /v1/idv/us/kyc/get` — US KYC 조회 (토큰 필요)
- `POST /v1/idv/jp/start` — JP IDV 시작
- `POST /v1/idv/jp/kyc/get` — JP KYC 조회 (토큰 필요)
- `POST /v1/idv/start` — 공통 IDV 시작 (토큰 필요)

## Docker

### 빌드 및 실행

```bash
# 단독 빌드
docker build -t idv-client-server .

# docker-compose (환경별)
docker compose up client-server-test   # test 환경 (port 8080)
docker compose up client-server-dev    # dev 환경 (port 8081)
docker compose up client-server-prod   # prod 환경 (port 8082)
```

### 환경별 설정 (docker-compose.yaml)

| Service | Port | IDV_BASE_URL |
|---------|------|-------------|
| `client-server-test` | 8080:3000 | `https://test.tomopayment.com` |
| `client-server-dev` | 8081:3000 | `https://dev.tomopayment.com` |
| `client-server-prod` | 8082:3000 | `https://api.tomopayment.com` |

현재 이미지 태그: `tomoadmin/idv-client-server:test-0.0.2.4`

## 소스 구조

```
src/
  main.ts              — NestJS 부트스트랩 (CORS 전체 허용)
  app.module.ts         — 루트 모듈
  app.controller.ts     — 모든 HTTP 라우트 (30+ 엔드포인트)
  app.service.ts        — 비즈니스 로직 (IdvServerClient 호출)
  state.service.ts      — 인메모리 상태 관리 (토큰 저장 등)

  idvServer/
    idvServerClient.ts  — IdvServerClient 재수출

  sdk/
    index.ts            — 배럴 파일 (타입, 클라이언트, 유틸리티 수출)
    idv-client.ts       — IdvServerClient (generated DefaultApi 래퍼)
    api-contract.ts     — 요청 바디 타입 정의 (snake_case)
    tomo-idv-node.ts    — OAuth2 JWT 어설션 생성 (ES256/P-256)
    case-converter.ts   — snake_case ↔ camelCase 변환 유틸리티
    generated/          — OpenAPI Generator 산출물 (수동 편집 금지)
```
