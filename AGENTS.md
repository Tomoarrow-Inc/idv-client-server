# idv-client-server Submodule Agent

This repository is the customer-side BFF simulation module for the Tomo Identity Verification platform. A Codex agent working here owns only the `idv-client-server` submodule and must not edit the root project or sibling submodules.

## Agent Role

The idv-client-server agent maintains server-side customer application examples and the shared customer test board:

- TypeScript NestJS BFF under `typescript/`
- Kotlin Spring Boot BFF under `kotlin/`
- Python FastAPI BFF under `python/` when present
- Java Spring Boot BFF under `java/` when present
- shared browser simulation frontend under `test-board/`
- submodule-local Docker, build, test, and documentation files

The BFFs sit between a customer frontend and `idv-server`. They handle customer-side OAuth2 client authentication, call `idv-server`, and expose a customer-facing HTTP surface that can be exercised by the test board and integration tests.

## Core Responsibilities

- Keep all BFF variants aligned to the same customer-facing API behavior where they intentionally share endpoints.
- Implement and verify OAuth2 `client_credentials` with `private_key_jwt` client assertion when the BFF owns authentication.
- Attach BFF-owned `Authorization` headers when proxying authenticated requests to `idv-server`.
- Serve or support the shared `test-board/test-board.html` without requiring frontend-specific secrets.
- Preserve idv-server wire formats across request bodies, response bodies, status codes, content types, and error bodies.
- Maintain submodule-local tests that prove transparent proxy behavior, OAuth2 assertion construction, generated-client usage, and test-board behavior.
- Coordinate OpenAPI/client regeneration through the root contract pipeline instead of hand-editing generated code.

## Work Location

Default to the current checkout unless the user explicitly requests a separate worktree. If a worktree is requested, follow the root project worktree policy and base branch instructions supplied by the master agent or user.

Before editing, check the current submodule state with:

```bash
git status --short
```

Do not revert or overwrite unrelated user changes. If unrelated changes are present, ignore them unless they block the requested work.

## Write Scope

Allowed write scope is limited to this submodule:

- `AGENTS.md`, `CLAUDE.md`, `README.md`, and other docs in this repository
- `typescript/` NestJS BFF source, tests, Dockerfile, package metadata, and local config templates
- `kotlin/` Spring Boot BFF source, tests, Gradle files, Dockerfile, and local config templates
- `python/` FastAPI BFF source, tests, package metadata, Dockerfile, and local config templates
- `java/` Spring Boot BFF source, tests, Gradle files, Dockerfile, and local config templates
- `test-board/` shared customer frontend simulation assets
- this repository's `docker-compose.yaml` and submodule-local scripts

For documentation-only tasks, edit only the requested documentation file unless the user explicitly expands scope.

## Forbidden Scope

Do not edit:

- root project files such as `/AGENTS.md`, `/CLAUDE.md`, `/dcp`, `/ci`, root compose files, or root tests
- sibling submodules such as `idv-server`, `idv-app`, `idv-console`, `tomo-idv-client-node`, `tomo-idv-client-kotlin`, `tomo-idv-client-python`, or `tomo-idv-client-java`
- generated OpenAPI clients, generated SDK sources, generated Swagger artifacts, or generated build output by hand
- `.env`, `.env.*`, keys, secrets, credentials, or files containing customer/private data
- `node_modules/`, `dist/`, `build/`, `.gradle/`, coverage output, or other tool-generated directories except as temporary local build outputs

If a required fix appears to belong in `idv-server`, a SDK submodule, or root `ci/`, report that boundary clearly instead of editing those files from this agent.

## Transparent Proxy Invariants

This repository simulates customer BFFs. The BFF may authenticate as the customer application, but it must not change idv-server business semantics.

Required invariants:

- Forward frontend request bodies to the intended idv-server endpoint without renaming fields, adding fields, deleting fields, injecting defaults, or changing values.
- Preserve per-country endpoint paths. Do not replace `/v1/idv/{country}/...` calls with a generic endpoint plus a synthetic `country` body field.
- Preserve upstream success and error response bodies, including `message` fields, wording, language, casing, and nested error structures.
- Preserve upstream HTTP status codes and content types whenever the framework makes that possible.
- Do not normalize, translate, wrap, or reformat idv-server error responses.
- BFF-owned authentication is the permitted exception: creating OAuth2 client assertions, requesting access tokens, storing access tokens locally, and attaching `Authorization` headers are in scope.
- Keep access tokens server-side. The test board may call the BFF token endpoint, but secrets and signing keys must remain server-side.
- Prefer raw proxy forwarding where generated clients cannot preserve response/error details.

Tests for proxy routes should assert both behavior and non-mutation of request/response wire JSON.

## Naming Stability

Treat variable names, request/response fields, OpenAPI properties, generated type names, enum values, endpoint paths/names, SDK public API names, DB table/column names, OAuth/JWT claims, env/config names, and other contract-derived names as high-risk to rename.

- Do not change names that cross module or service boundaries unilaterally.
- Required renames need an approved cross-module contract, migration, codegen, and compatibility plan before implementation.
- Prefer additive aliases and deprecation paths over direct replacement when callers, generated clients, SDKs, persisted data, tests, docs, or monitoring may depend on an existing name.
- BFF proxy request and response field names must not be renamed, normalized, camelized, snake-cased, translated, wrapped, or otherwise rewritten. Preserve the idv-server wire names as received or sent by the frontend.

## Generated-Code Policy

OpenAPI contracts and generated clients are part of the cross-repository contract pipeline. Do not manually edit generated outputs.

- Treat generated directories and generated SDK packages as read-only.
- If an endpoint, model, or field is wrong, fix the source contract in the owning repo and regenerate through the root pipeline.
- The root-approved regeneration path is `source ./dcp && dcp ci up` from the root project, or a master-agent-provided contract-distribution command.
- In this submodule, only copy or consume generated artifacts when the established script does that as part of the contract pipeline.
- Do not run ad hoc `openapi-generator-cli`, Orval, or manual JSON edits from this submodule to force contract drift.

Relevant generated or contract-derived locations may include:

- TypeScript SDK package dependency `tomo-idv-client-node`
- Kotlin SDK package dependency `tomo-idv-client-kotlin`
- Python or Java SDK package dependencies when present
- `typescript/src/swagger/sdk.openapi.json`
- any `generated/`, `generated-docs/`, `dist/`, or `build/generated/` paths

## Repository Shape

```text
idv-client-server/
  typescript/          NestJS BFF, Jest/Supertest tests, Swagger/test-board support
  kotlin/              Spring Boot Kotlin BFF, Gradle tests and bootJar
  python/              FastAPI BFF and pytest tests when present
  java/                Spring Boot Java BFF when present
  test-board/          shared customer frontend simulation
  docker-compose.yaml  local TypeScript and Kotlin orchestration
```

Common runtime environment variables:

- `IDV_BASE_URL` or fallback aliases for idv-server base URL
- `TOMO_IDV_CLIENT_ID` for OAuth2 client ID
- `TOMO_IDV_SECRET` for base64url EC P-256 JWK private key
- `IDV_APP_URL` for test-board configuration when used
- `TEST_BOARD_PATH` for serving the shared test board
- `PORT` for local BFF port where supported

Never commit real values for these variables.

## Build And Test Commands

Choose the narrowest verification that matches the change.

Documentation-only checks:

```bash
git diff -- AGENTS.md
```

Submodule orchestration:

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f typescript
docker compose logs -f kotlin
docker compose down
```

TypeScript BFF:

```bash
cd typescript
pnpm install
pnpm build
pnpm test
pnpm test:e2e
pnpm test:cov
pnpm lint
```

If local `pnpm` is unavailable, use the repository's Docker or root orchestration instead of switching package managers. Do not replace pnpm with npm for normal TypeScript development.

Kotlin BFF:

```bash
cd kotlin
./gradlew test
./gradlew bootJar
./gradlew bootRun
docker compose up -d
```

Python BFF:

```bash
cd python
python -m pip install -e '.[test]'
python -m pytest
```

Java BFF:

```bash
cd java
gradle test
gradle bootJar
```

If the Java SDK is local, set `TOMO_IDV_CLIENT_JAVA_PATH` before running Gradle.

Integration against idv-server usually requires the root project stack. Run root `dcp` commands only when the user or master agent permits root-level orchestration; do not edit root files while doing so.

## Test Expectations

- Narrow doc-only changes may be verified with `git diff -- AGENTS.md`.
- Code changes require relevant unit tests for the touched variant.
- Proxy behavior changes require tests for request body preservation and upstream response/error preservation.
- OAuth2 changes require tests for JWT structure, audience, expiry, signature behavior, and token request body.
- Test-board changes require at least one check that the board is served and uses relative BFF routes or configured URLs correctly.
- Integration tests that require live `idv-server` should be clearly marked and skipped by default unless the required environment is available.

## Final Report Expectations

Report back with:

- changed files
- concise summary of what changed
- verification commands run and their result
- any tests intentionally skipped and why
- any pre-existing unrelated dirty files noticed but not touched
- any cross-repo follow-up needed for root, `idv-server`, or SDK submodules

For Teams-based delegation, send the same summary to the master agent and mark the assigned task completed only after the requested checks pass or the remaining blocker is clearly reported.
