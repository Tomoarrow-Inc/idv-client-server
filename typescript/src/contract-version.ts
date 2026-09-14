/**
 * idv-server 의 SDK 계약 버전 경계(lib/App/Contract/Version.hs)에 대응하는 BFF 측 규칙.
 *
 * 서버는 아래 25개 operation 에만 게이트를 적용하고, 요청 값으로는 `1.4` 하나만
 * 받는다. header 를 아예 보내지 않으면 고정 v1.3.20 legacy 계약이 적용된다.
 * `1.3`, `1.3.20`, `1.4.0`, 빈 값, 중복 값은 모두 400 `unsupported_api_version` 이다.
 */

export const CONTRACT_VERSION_HEADER = 'Tomo-API-Version';

/** SDK 계약 1.4.0 이 25개 operation 전부에 required + enum ["1.4"] 로 요구하는 값. */
export const DEFAULT_CONTRACT_VERSION = '1.4';

/**
 * test-board 가 legacy(무헤더) 경로를 시험할 때 쓰는 BFF 전용 제어 header.
 * BFF 가 소비하고 절대 upstream 으로 전달하지 않는다. Authorization 과 같은
 * "BFF 가 소유하는 header" 범주이며 idv-server 계약에는 존재하지 않는다.
 */
export const CONTRACT_MODE_HEADER = 'x-tomo-contract-mode';
export const CONTRACT_MODE_LEGACY = 'legacy';

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

export const DEFAULT_SELECTION: ContractSelection = {
  version: DEFAULT_CONTRACT_VERSION,
  omit: false,
};

/**
 * 들어온 요청 header 로부터 upstream 계약 선택을 정한다.
 *
 * - 제어 header 가 legacy 면 버전 header 를 생략한다.
 * - 호출자가 버전을 명시하면 **검증 없이 그대로** 쓴다. 값 검증은 idv-server 의
 *   몫이고, BFF 가 미리 거르면 호출자가 실제 400 을 볼 수 없다.
 * - 아무것도 없으면 SDK 계약이 요구하는 1.4 를 기본으로 붙인다.
 */
export function resolveContractSelection(
  headers: Record<string, string | string[] | undefined> | undefined,
): ContractSelection {
  const mode = firstHeaderValue(headers?.[CONTRACT_MODE_HEADER]);
  if (mode?.trim().toLowerCase() === CONTRACT_MODE_LEGACY) {
    return { version: '', omit: true };
  }

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
