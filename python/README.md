# idv-client-server-python

Python FastAPI BFF that mirrors the TypeScript BFF surface:

- `POST /v1/oauth2/token`
- `POST /v1/idv/start`
- `POST /v1/idv/result`
- `GET /test-board`
- `GET /test-board/config`

The local compose service mounts `tomo-idv-client-python` and installs it in editable mode before starting the server.
