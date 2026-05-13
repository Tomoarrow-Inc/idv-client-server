from __future__ import annotations

from tomo_idv_client.generated import ResultReq, StartIdvReq

from app.config import Settings
from app.services import IdvBffService
from app.state import StateStore


SETTINGS = Settings(
    idv_base_url="http://idv-server",
    client_id="client-id",
    secret_key="secret-key",
    test_board_path="../test-board/test-board.html",
    idv_app_url="http://localhost:8080",
)


class _TokenResponse:
    access_token = "issued-token"
    token_type = "Bearer"
    expires_in = 3600
    scope = "idv.read"

    def to_dict(self) -> dict[str, object]:
        return {
            "access_token": self.access_token,
            "token_type": self.token_type,
            "expires_in": self.expires_in,
            "scope": self.scope,
        }


class _FakeApi:
    def __init__(self) -> None:
        self.token_args: dict[str, object] | None = None
        self.start_authorization: str | None = None
        self.start_request: StartIdvReq | None = None
        self.result_authorization: str | None = None
        self.result_request: ResultReq | None = None

    def v1_oauth2_token_post(self, **kwargs: object) -> _TokenResponse:
        self.token_args = kwargs
        return _TokenResponse()

    def v1_idv_start_post(
        self,
        authorization: str,
        start_idv_req: StartIdvReq,
    ) -> dict[str, object]:
        self.start_authorization = authorization
        self.start_request = start_idv_req
        return {"url": "https://idv.example/session"}

    def v1_idv_result_post(
        self,
        authorization: str,
        result_req: ResultReq,
    ) -> dict[str, object]:
        self.result_authorization = authorization
        self.result_request = result_req
        return {"records": []}


def test_issue_token_stores_generated_sdk_token(monkeypatch) -> None:
    # 이 테스트는 Python BFF가 SDK client assertion을 만들고 발급된 access_token을 이후 프록시 호출용 상태로 저장하는지 검증한다.
    fake_api = _FakeApi()
    state = StateStore()
    monkeypatch.setattr("app.services.create_client_assertion", lambda _options: "assertion")

    service = IdvBffService(SETTINGS, state, api=fake_api)

    response = service.issue_client_credentials_token()

    assert response["access_token"] == "issued-token"
    assert state.get("access_token") == "issued-token"
    assert fake_api.token_args["client_assertion"] == "assertion"


def test_start_uses_generated_request_and_bearer_token() -> None:
    # 이 테스트는 /v1/idv/start 입력이 SDK의 StartIdvReq로 변환되고 Bearer 토큰과 함께 그대로 전달되는지 검증한다.
    fake_api = _FakeApi()
    state = StateStore()
    state.set("access_token", "access-token")
    service = IdvBffService(SETTINGS, state, api=fake_api)

    service.idv_start(
        {
            "callback_url": "https://example.com/callback",
            "country": "us",
            "user_id": "user-1",
        }
    )

    assert fake_api.start_authorization == "Bearer access-token"
    assert isinstance(fake_api.start_request, StartIdvReq)
    assert fake_api.start_request.user_id == "user-1"


def test_result_uses_generated_request_and_bearer_token() -> None:
    # 이 테스트는 /v1/idv/result 입력이 SDK의 ResultReq로 변환되고 TypeScript BFF와 같은 인증 헤더로 전달되는지 검증한다.
    fake_api = _FakeApi()
    state = StateStore()
    state.set("access_token", "access-token")
    service = IdvBffService(SETTINGS, state, api=fake_api)

    service.idv_result({"country": "us", "user_id": "user-1"})

    assert fake_api.result_authorization == "Bearer access-token"
    assert isinstance(fake_api.result_request, ResultReq)
    assert fake_api.result_request.user_id == "user-1"
