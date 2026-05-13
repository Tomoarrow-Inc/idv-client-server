from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from tomo_idv_client.generated.exceptions import ApiException

from app.config import Settings, load_settings
from app.services import IdvBffService, upstream_response
from app.state import StateStore


def create_app(
    service: IdvBffService | None = None,
    settings: Settings | None = None,
) -> FastAPI:
    resolved_settings = settings or load_settings()
    resolved_service = service or IdvBffService(resolved_settings, StateStore())
    app = FastAPI(title="IDV Client Server Python")
    app.state.idv_bff_service = resolved_service
    app.state.idv_settings = resolved_settings

    @app.exception_handler(ApiException)
    async def handle_api_exception(_request: Request, error: ApiException) -> Response:
        status, body, content_type = upstream_response(error)
        return Response(content=body, status_code=status, media_type=content_type)

    @app.exception_handler(RuntimeError)
    async def handle_runtime_error(_request: Request, error: RuntimeError) -> JSONResponse:
        return JSONResponse(status_code=502, content={"message": str(error)})

    @app.get("/")
    async def hello() -> dict[str, str]:
        return {"message": "Hello World!"}

    @app.post("/v1/oauth2/token")
    async def issue_client_credentials_token() -> Any:
        return app.state.idv_bff_service.issue_client_credentials_token()

    @app.post("/v1/idv/start")
    async def idv_start(body: dict[str, Any]) -> Any:
        return app.state.idv_bff_service.idv_start(body)

    @app.post("/v1/idv/result")
    async def idv_result(body: dict[str, Any]) -> Any:
        return app.state.idv_bff_service.idv_result(body)

    @app.get("/test-board")
    async def test_board() -> FileResponse:
        path = Path(app.state.idv_settings.test_board_path)
        return FileResponse(path)

    @app.get("/test-board/config")
    async def test_board_config() -> dict[str, str]:
        return {
            "idvServerUrl": app.state.idv_settings.idv_base_url,
            "idvAppUrl": app.state.idv_settings.idv_app_url,
        }

    return app


app = create_app()
