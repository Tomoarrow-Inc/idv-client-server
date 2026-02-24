# idv-client-server

Backend For Frontend (BFF) server for idv-client. Handles OAuth2 client-assertion flow and proxies requests to idv-server.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Package Manager**: pnpm
- **Runtime**: Node.js 20
- **Testing**: Jest 30 + Supertest

## Build & Run

```bash
pnpm install

# Development
pnpm start:dev              # Watch mode with hot reload
pnpm start:debug            # Debug + watch mode

# Production build
pnpm build                  # nest build
pnpm start:prod             # Run compiled output

# Testing
pnpm test                   # Unit tests (Jest)
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report
pnpm test:e2e               # End-to-end tests

# Linting & formatting
pnpm lint                   # ESLint with auto-fix
pnpm format                 # Prettier (src + test)

# API client generation
pnpm gen                    # Orval + openapi-generator-cli
pnpm sync-client            # Copy generated client to src/sdk/generated/
```

## Source Structure

```
src/
  app.module.ts      — Root NestJS module
  state.service.ts   — Application state service
  idvServer/         — IDV server integration module
    idvServerClient.ts — HTTP client for idv-server
  sdk/
    tomo-idv-node.ts — OAuth2 JWT assertion logic (ES256/P-256)
    generated/       — Generated OpenAPI client (DO NOT edit manually)
```

## Testing

- Test files: `*.spec.ts` in `src/`
- E2E tests: `test/` directory with `jest-e2e.json` config
- Coverage output: `coverage/`

## Configuration

- `nest-cli.json` — NestJS CLI config (source root: `src`, delete output on rebuild)
- `.env` — Environment variables (IDV_BASE_URL, etc.)
- Local dev port: 3000 (mapped to 4300 in docker-compose)

## Important Notes

- Uses pnpm (not npm) — always use `pnpm` commands
- `src/sdk/generated/` is auto-generated — run `pnpm gen` after OpenAPI spec changes
- Dockerfile stages: `development` (pnpm dev), `production` (pnpm prod)
