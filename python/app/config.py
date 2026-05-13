from __future__ import annotations

import os
from dataclasses import dataclass


def _strip_trailing_slash(value: str) -> str:
    return value.rstrip("/")


@dataclass(frozen=True)
class Settings:
    idv_base_url: str
    client_id: str
    secret_key: str
    test_board_path: str
    idv_app_url: str


def load_settings() -> Settings:
    base_url = (
        os.getenv("IDV_BASE_URL")
        or os.getenv("IDV_SERVER")
        or os.getenv("IDV_BASEURL")
        or "http://idv-server-ghci"
    )
    return Settings(
        idv_base_url=_strip_trailing_slash(base_url),
        client_id=os.getenv("TOMO_IDV_CLIENT_ID", ""),
        secret_key=os.getenv("TOMO_IDV_SECRET", ""),
        test_board_path=os.getenv("TEST_BOARD_PATH", "../test-board/test-board.html"),
        idv_app_url=os.getenv("IDV_APP_URL", ""),
    )
