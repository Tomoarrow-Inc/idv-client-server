# idv-client-server

Multi-project BFF (Backend For Frontend) module for IDV platform. Contains TypeScript (NestJS) and Kotlin (Spring Boot) implementations that proxy requests to idv-server.

## Project Structure

```
idv-client-server/
├── typescript/          ← NestJS 11 BFF (existing implementation)
│   ├── src/
│   ├── test/
│   ├── scripts/
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yaml
├── kotlin/              ← Spring Boot 3.4 BFF (Kotlin implementation)
│   ├── src/main/kotlin/com/tomoarrow/idv/bff/
│   ├── src/main/resources/
│   ├── build.gradle.kts
│   ├── Dockerfile
│   └── docker-compose.yaml
├── test-board/          ← Customer Frontend simulation
│   └── test-board.html
├── .gitignore
├── CLAUDE.md
└── README.md
```

## TypeScript BFF (typescript/)

NestJS 11 application. See `typescript/` for source code.

### Build & Run

```bash
# Docker (recommended - no local pnpm needed)
docker run --rm -v "$(pwd)/typescript":/app -w /app node:20-alpine sh -c "npm install -g pnpm && pnpm install && pnpm build"

# Docker Compose (from idv-client-server root)
cd typescript && docker compose up client-server-test -d
```

### Key Paths

- Source: `typescript/src/`
- Generated SDK: `typescript/src/sdk/generated/`
- Copy script: `typescript/scripts/copy-openapi-client.mjs`
- Tests: `typescript/test/`

## Kotlin BFF (kotlin/)

Spring Boot 3.4 application using the `idv-kotlin-client` SDK.

### Build & Run

```bash
# Gradle build (requires JDK 21)
cd kotlin && ./gradlew bootJar

# Docker (from idv-client-server root)
docker build -f kotlin/Dockerfile -t idv-bff-kotlin .

# Docker Compose
cd kotlin && docker compose up bff-kotlin -d
```

### Key Paths

- Source: `kotlin/src/main/kotlin/com/tomoarrow/idv/bff/`
- Config: `kotlin/src/main/resources/application.yml`
- Build: `kotlin/build.gradle.kts`

### Dependencies

- `com.tomoarrow.idv:idv-kotlin-client:1.0.0-SNAPSHOT` (from mavenLocal)
- `com.nimbusds:nimbus-jose-jwt:10.3` (JWT client assertion)
- Spring Boot 3.4.4 + Kotlin 2.1.20

## Test Board (test-board/)

Static HTML page simulating the customer frontend for OIDC Social KYC flow testing. Shared between both TypeScript and Kotlin implementations.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `IDV_BASE_URL` | Yes | Base URL for idv-server |
| `TOMO_IDV_CLIENT_ID` | Yes | OAuth2 client ID |
| `TOMO_IDV_SECRET` | Yes | Base64url-encoded EC P-256 JWK private key |
| `GOOGLE_CLIENT_ID` | Yes (test board) | Google OAuth 2.0 Client ID |
| `IDV_APP_URL` | No | idv-app URL |
| `PORT` | No | Server port (default: 3000) |

## Docker Compose Ports (superproject)

| Service | Port | Implementation |
|---|---|---|
| idv-client-server | :4300 | TypeScript (NestJS) |
| idv-client-server-kotlin | :4301 | Kotlin (Spring Boot) |
