# idv-client-server (Kotlin BFF)

<<<<<<< HEAD
Spring Boot 3.4 기반 BFF입니다. OAuth2 client-assertion으로 idv-server에 인증하고, KYC API를 프록시합니다.
=======
Spring Boot 3.4 기반 BFF. OAuth2 client-assertion으로 idv-server에 인증하고, KYC API를 프록시한다.
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)

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

<<<<<<< HEAD
`.env` 파일 예시:

```env
IDV_BASE_URL=https://test.tomopayment.com
TOMO_IDV_CLIENT_ID=
TOMO_IDV_SECRET=
GOOGLE_CLIENT_ID=
WECHAT_CLIENT_APP_ID=
TEST_BOARD_PATH=../../test-board/test-board.html
```

=======
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)
## 빠른 시작

### 1. `.env` 파일 생성

```bash
cp .env.example .env
<<<<<<< HEAD
# .env 파일에 TOMO_IDV_CLIENT_ID, TOMO_IDV_SECRET 값을 입력해주세요
=======
# .env 파일에 TOMO_IDV_CLIENT_ID, TOMO_IDV_SECRET 값 입력
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)
```

### 2. Docker 빌드 및 실행

```bash
<<<<<<< HEAD
cd idv-client-server/kotlin
docker compose up -d bff-kotlin
=======
# superproject 루트에서
source ./dcp
dcp ghci up -d idv-client-server-kotlin

# 또는 단독 실행
cd idv-client-server/kotlin
docker compose up -d
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)
```

### 3. 확인

```bash
<<<<<<< HEAD
curl http://localhost:3000/test-board
=======
# 포트 4301 (docker-compose-local.yaml 기준)
curl http://localhost:4301/test-board
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)
```

## SDK 의존성

<<<<<<< HEAD
Maven Central에서 [tomo-idv-client-kotlin](https://central.sonatype.com/artifact/io.github.tomoarrow-inc/tomo-idv-client-kotlin)을 가져옵니다.
=======
Maven Central에서 [tomo-idv-client-kotlin](https://central.sonatype.com/artifact/io.github.tomoarrow-inc/tomo-idv-client-kotlin)을 가져온다.
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)

```kotlin
// build.gradle.kts
implementation("io.github.tomoarrow-inc:tomo-idv-client-kotlin:1.0.2")
```
<<<<<<< HEAD
=======

### 로컬 SDK 테스트

로컬에서 수정한 SDK를 테스트하려면 `build.gradle.kts`와 `Dockerfile`의 `[LOCAL SDK]` 주석을 참고하라.
>>>>>>> 2b7d098 (docs: Kotlin BFF README.md 추가 + .env.example에서 IDV_APP_URL 제거)
