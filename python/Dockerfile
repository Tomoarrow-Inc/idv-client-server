FROM python:3.12-slim AS development

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /workspace/python

COPY python/pyproject.toml python/README.md ./
COPY python/app ./app
COPY python/tests ./tests
COPY test-board /workspace/test-board
COPY --from=tomo-idv-client-python . /tomo-idv-client-python

RUN pip install --no-cache-dir -e /tomo-idv-client-python \
    && pip install --no-cache-dir -e .[test]

ENV TEST_BOARD_PATH=/workspace/test-board/test-board.html
EXPOSE 3000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]

FROM development AS production

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
