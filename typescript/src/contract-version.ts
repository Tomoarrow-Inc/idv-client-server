/**
 * idv-server 의 SDK 계약 버전 경계(lib/App/Contract/Version.hs)에 대응하는 BFF 측 규칙.
 *
 * 서버는 아래 25개 operation 에만 게이트를 적용하고, 요청 값으로는 `1.4` 하나만
 * 받는다. header 를 아예 보내지 않으면 고정 v1.3.20 legacy 계약이 적용된다.
 * `1.3`, `1.3.20`, `1.4.0`, 빈 값, 중복 값은 모두 400 `unsupported_api_version` 이다.
 */

export const CONTRACT_VERSION_HEADER = 'Tomo-API-Version';

/** 명시 선택으로 고를 수 있는 유일한 값. 계약 1.4.0 이 enum ["1.4"] 로 못박았다. */
export const EXPLICIT_CONTRACT_VERSION = '1.4';

/**
 * 재생성된 SDK 는 25개 method 전부에서 Tomo_API_Version 을 required + enum
 * ["1.4"] 로 요구하고, 없으면 RequiredError 를 던진다. 즉 생성 client 는
 * legacy 호출을 타입으로도 런타임으로도 표현하지 못한다.
 *
 * 그래서 BFF 는 이 값으로 SDK 의 요구를 만족시킨 뒤, legacy 선택일 때만
 * contractInit 에서 실제 header 를 떼어낸다. 요청 구성(경로·인증·직렬화)은
 * SDK 를 그대로 쓰면서 wire 에서만 legacy 를 표현하는 유일한 방법이다.
 */
export const SDK_VERSION_PARAM = '1.4' as const;

/**
 * idv-server lib/App/Contract/Version.hs 의 sdkOperations 와 1:1 대응한다.
 * 서버는 (method, path) 정확 일치로 판정하므로 path 목록만으로 충분하다
 * (BFF 가 프록시하는 라우트 중 중복 method 를 갖는 path 는 없다).
 */
export const SDK_CONTRACT_PATHS: readonly string[] = [
  '/v1/oauth2/token',
  '/v1/idv/health',
  '/v1/idv/start',
  '/v1/idv/result',
  '/v1/idv/reset',
  '/v1/idv/kyc/get',
  '/v1/idv/result/delete',
  '/v1/idv/result/bulk-delete',
  '/v1/idv/sessions/start',
  '/v1/idv/cn/token',
  ...['us', 'uk', 'ca', 'jp', 'cn'].flatMap((country) => [
    `/v1/idv/${country}/health`,
    `/v1/idv/${country}/start`,
    `/v1/idv/${country}/kyc/get`,
  ]),
];

export interface ContractSelection {
  /** upstream 으로 보낼 버전 값. omit 이면 무시된다. */
  version: string;
  /** true 면 버전 header 를 아예 보내지 않는다 (legacy 계약 경로). */
  omit: boolean;
}

/**
 * 아무 지시가 없으면 버전 header 를 보내지 않는다 = idv-server 가 legacy
 * (고정 v1.3.20) 계약을 적용한다. 계약 선택권은 호출자에게 있고, BFF 가
 * 기본값을 주입하면 호출자 모르게 응답 형태가 바뀐다.
 */
export const DEFAULT_SELECTION: ContractSelection = {
  version: '',
  omit: true,
};

/** 명시 1.4 선택. */
export const EXPLICIT_SELECTION: ContractSelection = {
  version: EXPLICIT_CONTRACT_VERSION,
  omit: false,
};

/**
 * 들어온 요청 header 로부터 upstream 계약 선택을 정한다. 투명 전달이다.
 *
 * - 호출자가 버전을 명시하면 **검증 없이 그대로** 쓴다. 값 검증은 idv-server 의
 *   몫이고, BFF 가 미리 거르면 호출자가 실제 400 을 볼 수 없다.
 * - 호출자가 아무것도 안 보내면 BFF 도 안 보낸다 = legacy 계약.
 *   header 부재가 곧 1.3 선택이라는 것이 idv-server 의 표현 방식이다.
 */
export function resolveContractSelection(
  headers: Record<string, string | string[] | undefined> | undefined,
): ContractSelection {
  const requested = firstHeaderValue(
    headers?.[CONTRACT_VERSION_HEADER.toLowerCase()],
  );
  if (requested !== undefined) {
    return { version: requested, omit: false };
  }

  return DEFAULT_SELECTION;
}

function firstHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    // 중복 header 는 idv-server 가 400 으로 거부한다. 합쳐서 그대로 넘겨
    // 그 거부를 호출자가 볼 수 있게 한다.
    return value.join(',');
  }
  return value;
}

/** 기존 header 집합에 계약 선택을 반영한 새 집합을 만든다. */
export function withContractHeaders(
  headers: Record<string, string>,
  selection: ContractSelection,
): Record<string, string> {
  const next = { ...headers };
  delete next[CONTRACT_VERSION_HEADER];
  if (!selection.omit) {
    next[CONTRACT_VERSION_HEADER] = selection.version;
  }
  return next;
}
