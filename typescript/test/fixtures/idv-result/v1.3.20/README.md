# `/v1/idv/result` 계약 1.3 golden (복사본)

## 출처

`idv-server/test/fixtures/idv-result/v1.3.20/` 에서 byte-for-byte 복사했다.
원본 README 가 밝히듯 **현재 serializer 로 생성하지 않은 독립 golden** 이며,
"새 serializer 를 통과시키기 위해 이 계약이나 golden 을 재생성하지 않는다".

대응 고정 계약은 root `ci/contracts/openapi/v1.3.20/sdk.openapi.json`,
SHA-256 `ad7cd4a6167bb6b2bc631e009ba98b3e6fdefae741899cfde4810d58c9bd11e9`.

서브모듈 간 파일 참조는 CI 에서 깨지기 쉬워 복사했다. 원본이 동결물이라
갈라질 위험은 낮다. 모든 개인정보와 식별자는 합성 값이다.

## 파일

| 파일 | 검증 대상 |
|---|---|
| `plaid-{single,list}.json` | 기존 합성 Plaid row 의 업무 값 |
| `kr-{single,list}.json` | KR 인증서 DTO 의 선택 필드 부재 |
| `all-fields-{single,list}.json` | 모든 선택 필드의 `Just` 및 빈 문자열 보존 |
| `no-optionals-{single,list}.json` | 선택 9개가 모두 없어도 필수 개인정보 보존 |

## 여기서 쓰는 이유

BFF 는 계약 1.3 응답을 역직렬화 없이 통과시킨다. 재생성된 SDK 의 `ResultRes`
는 1.4 전용 oneOf 라 두 갈래 모두 `user_id` 를 required 로 요구하고, 1.3 body
를 넣으면 `FromJSONTyped` 가 `{}` 를 돌려준다 — 조용한 전량 유실이다.

지금 그 raw 통과를 지키는 것은 주석뿐이다. 누가 `.value()` 로 바꾸면 소리 없이
깨진다. `src/legacy-result-passthrough.spec.ts` 가 이 golden 으로 그 경로를
고정한다.
