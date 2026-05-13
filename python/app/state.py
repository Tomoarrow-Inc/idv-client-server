from __future__ import annotations

from threading import Lock
from typing import Any


class StateStore:
    def __init__(self) -> None:
        self._values: dict[str, Any] = {}
        self._lock = Lock()

    def set(self, key: str, value: Any) -> None:
        with self._lock:
            self._values[key] = value

    def get(self, key: str) -> Any:
        with self._lock:
            return self._values.get(key)

    def clear(self) -> None:
        with self._lock:
            self._values.clear()
