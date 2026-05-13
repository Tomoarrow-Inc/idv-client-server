from __future__ import annotations

from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app


class _RouteService:
    def __init__(self) -> None:
        self.start_body: dict[str, object] | None = None
        self.result_body: dict[str, object] | None = None

    def issue_client_credentials_token(self) -> dict[str, object]:
        return {"access_token": "issued-token", "token_type": "Bearer"}

    def idv_start(self, body: dict[str, object]) -> dict[str, object]:
        self.start_body = body
        return {"url": "https://idv.example/session"}

    def idv_result(self, body: dict[str, object]) -> dict[str, object]:
        self.result_body = body
        return {"records": []}


def _settings() -> Settings:
    return Settings(
        idv_base_url="http://idv-server",
        client_id="client-id",
        secret_key="secret-key",
        test_board_path="../test-board/test-board.html",
        idv_app_url="http://localhost:8080",
    )


def test_routes_match_typescript_bff_surface() -> None:
    # 이 테스트는 TypeScript BFF와 같은 세 핵심 라우트가 Python 서비스 계층으로 연결되는지 검증한다.
    service = _RouteService()
    client = TestClient(create_app(service=service, settings=_settings()))

    token = client.post("/v1/oauth2/token")
    start = client.post("/v1/idv/start", json={"callback_url": "https://example.com", "user_id": "u"})
    result = client.post("/v1/idv/result", json={"user_id": "u"})

    assert token.status_code == 200
    assert token.json()["access_token"] == "issued-token"
    assert start.status_code == 200
    assert service.start_body == {"callback_url": "https://example.com", "user_id": "u"}
    assert result.status_code == 200
    assert service.result_body == {"user_id": "u"}
