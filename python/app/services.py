from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from tomo_idv_client import (
    CLIENT_ASSERTION_TYPE,
    DEFAULT_RESOURCE,
    ClientAssertionOptions,
    create_client_assertion,
)
from tomo_idv_client.generated import ApiClient, Configuration, DefaultApi, ResultReq, StartIdvReq
from tomo_idv_client.generated.exceptions import ApiException

from app.config import Settings
from app.state import StateStore


def _model_to_dict(value: Any) -> Any:
    if hasattr(value, "to_dict"):
        return value.to_dict()
    return value


class IdvBffService:
    def __init__(
        self,
        settings: Settings,
        state_store: StateStore,
        api: DefaultApi | None = None,
    ) -> None:
        self._settings = settings
        self._state_store = state_store
        self._api = api or DefaultApi(
            ApiClient(Configuration(host=settings.idv_base_url))
        )

    def issue_client_credentials_token(self) -> Any:
        if not self._settings.client_id or not self._settings.secret_key:
            raise RuntimeError("TOMO_IDV_CLIENT_ID and TOMO_IDV_SECRET must be set.")

        client_assertion = create_client_assertion(
            ClientAssertionOptions(
                client_id=self._settings.client_id,
                secret_key=self._settings.secret_key,
                base_url=self._settings.idv_base_url,
            )
        )
        token_response = self._api.v1_oauth2_token_post(
            client_assertion=client_assertion,
            client_assertion_type=CLIENT_ASSERTION_TYPE,
            grant_type="client_credentials",
            resource=DEFAULT_RESOURCE,
            scope="idv.read",
        )

        access_token = getattr(token_response, "access_token", None)
        self._state_store.set("access_token", access_token)
        self._state_store.set(
            "token_info",
            {
                "clientId": self._settings.client_id,
                "tokenType": getattr(token_response, "token_type", None),
                "expiresIn": getattr(token_response, "expires_in", None),
                "scope": getattr(token_response, "scope", None),
                "issuedAt": datetime.now(timezone.utc).isoformat(),
            },
        )
        return _model_to_dict(token_response)

    def idv_start(self, body: dict[str, Any]) -> Any:
        request = StartIdvReq.from_dict(body)
        response = self._api.v1_idv_start_post(
            authorization=self._bearer_token(),
            start_idv_req=request,
        )
        return _model_to_dict(response)

    def idv_result(self, body: dict[str, Any]) -> Any:
        request = ResultReq.from_dict(body)
        response = self._api.v1_idv_result_post(
            authorization=self._bearer_token(),
            result_req=request,
        )
        return _model_to_dict(response)

    def _bearer_token(self) -> str:
        access_token = self._state_store.get("access_token")
        if not isinstance(access_token, str) or not access_token:
            raise RuntimeError("No access token found. Please call /v1/oauth2/token first.")
        return f"Bearer {access_token}"


def upstream_response(error: ApiException) -> tuple[int, str, str | None]:
    status = error.status or 502
    body = error.body or str(error)
    content_type = None
    if error.headers:
        content_type = error.headers.get("content-type") or error.headers.get("Content-Type")
    return status, body, content_type
