# idv-client-server (Kotlin BFF)

Spring Boot 3.4 기반 BFF입니다. OAuth2 client-assertion으로 idv-server에 인증하고, KYC API를 프록시합니다.

## 환경변수

| 변수 | 필수 | 설명 | 예시 |
|---|---|---|---|
| `IDV_BASE_URL` | O | idv-server 주소 | `https://test.tomopayment.com` |
| `TOMO_IDV_CLIENT_ID` | O | OAuth2 클라이언트 ID | |
| `TOMO_IDV_SECRET` | O | Base64url EC P-256 JWK 비밀키 | |
| `GOOGLE_CLIENT_ID` | | Google Sign-In 클라이언트 ID (test-board용) | |
| `WECHAT_CLIENT_APP_ID` | | WeChat 앱 ID (test-board용) | |
| `TEST_BOARD_PATH` | | test-board.html 경로 (기본: `../../test-board/test-board.html`) | |
| `PORT` | | 서버 포트 (기본: 3000) | |

`.env` 파일 예시:

```env
IDV_BASE_URL=https://test.tomopayment.com
TOMO_IDV_CLIENT_ID=
TOMO_IDV_SECRET=
GOOGLE_CLIENT_ID=
WECHAT_CLIENT_APP_ID=
TEST_BOARD_PATH=../../test-board/test-board.html
```

## 빠른 시작

### 1. `.env` 파일 생성

```bash
cp .env.example .env
# .env 파일에 TOMO_IDV_CLIENT_ID, TOMO_IDV_SECRET 값을 입력해주세요
```

### 2. Docker 빌드 및 실행

```bash
# superproject 루트에서 실행합니다
source ./dcp
dcp ghci up -d idv-client-server-kotlin

# 또는 단독으로 실행할 수 있습니다
cd idv-client-server/kotlin
docker compose up -d
```

### 3. 확인

```bash
# 포트 4301 (docker-compose-local.yaml 기준)
curl http://localhost:4301/test-board
```

## SDK 의존성

Maven Central에서 [tomo-idv-client-kotlin](https://central.sonatype.com/artifact/io.github.tomoarrow-inc/tomo-idv-client-kotlin)을 가져옵니다.

```kotlin
// build.gradle.kts
implementation("io.github.tomoarrow-inc:tomo-idv-client-kotlin:1.0.2")
```

### 로컬 SDK 테스트

로컬에서 수정한 SDK를 테스트하시려면 `build.gradle.kts`와 `Dockerfile`의 `[LOCAL SDK]` 주석을 참고해주세요.
