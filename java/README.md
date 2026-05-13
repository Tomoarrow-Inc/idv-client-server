# idv-client-server-java

Spring Boot BFF that mirrors the TypeScript BFF surface:

- `POST /v1/oauth2/token`
- `POST /v1/idv/start`
- `POST /v1/idv/result`
- `GET /test-board`
- `GET /test-board/config`

The Gradle build uses the local `tomo-idv-client-java` SDK through an included build when `TOMO_IDV_CLIENT_JAVA_PATH` is set.
