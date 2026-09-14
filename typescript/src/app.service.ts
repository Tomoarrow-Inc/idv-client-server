import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, DefaultApi } from 'tomo-idv-client-node';
import { UpstreamResponseError } from './upstream-response';
import {
  CONTRACT_VERSION_HEADER,
  DEFAULT_SELECTION,
  SDK_VERSION_PARAM,
  withContractHeaders,
} from './contract-version';
import type { ContractSelection } from './contract-version';
import type {
  TokenRes,
  StartIdvRes,
  StartIdvReq,
  ResultReq,
  ResetReq,
  ResetRes,
  ResultDeleteReq,
  ResultDeleteRes,
  ResultBulkDeleteReq,
  ResultBulkDeleteRes,
} from 'tomo-idv-client-node';

/**
 * upstream 응답 body 와 idv-server 가 실제로 적용한 계약 버전을 함께 돌려준다.
 *
 * 25개 SDK operation 은 모두 버전 게이트를 거치므로, 어느 endpoint 를 불러도
 * "무슨 계약이 적용됐는지"를 호출자가 볼 수 있어야 한다. legacy 경로에서는
 * /v1/idv/result 를 뺀 24개에 버전 header 가 오지 않으므로 version 은
 * undefined 가 된다 — 오류가 아니라 정상이다.
 */
export interface UpstreamResponse<T> {
  body: T;
  version?: string;
}

/**
 * /v1/idv/result 응답은 계약 버전에 따라 봉투가 달라진다. 생성 SDK 는 1.4
 * 전용이라 legacy 응답을 표현하지 못하므로 wire 원문을 그대로 통과시킨다.
 */
export type UpstreamResultResponse = UpstreamResponse<unknown>;

const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID as string;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET as string;

@Injectable()
export class AppService {
  constructor(
    private readonly stateService: StateService,
    private readonly api: DefaultApi,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private bearerToken(): string {
    return `Bearer ${this.requireAccessToken()}`;
  }

  /**
   * 생성 SDK 의 모든 endpoint 에 계약 선택을 적용한다.
   *
   * initOverrides 반환값은 기본 init 위에 shallow spread 되므로 headers 를
   * 통째로 교체한다. Authorization·Content-Type 이 사라지지 않도록 기존
   * init.headers 를 반드시 다시 병합한다.
   *
   * 생성 SDK 는 Tomo_API_Version 을 required enum ["1.4"] 로 강제하므로 호출부는
   * 항상 SDK_VERSION_PARAM 을 넘긴다. legacy 선택이면 여기서 그 header 를
   * 다시 떼어내 wire 에서는 보내지 않는다.
   */
  private contractInit(selection: ContractSelection) {
    return async ({ init }: { init: RequestInit }) => ({
      headers: withContractHeaders(
        { ...((init.headers ?? {}) as Record<string, string>) },
        selection,
      ),
    });
  }

  /** upstream 응답 header 에서 idv-server 가 적용한 계약 버전을 읽는다. */
  private appliedVersion(raw: Response): string | undefined {
    return (
      raw.headers.get(CONTRACT_VERSION_HEADER.toLowerCase()) ?? undefined
    );
  }

  /** 생성 SDK 의 *Raw 호출을 body + 적용 버전 쌍으로 변환한다. */
  private async withVersion<T>(
    response: { raw: Response; value: () => Promise<T> },
  ): Promise<UpstreamResponse<T>> {
    const version = this.appliedVersion(response.raw);
    return { body: await response.value(), version };
  }

  // ── OAuth2 ──

  async issueClientCredentialsToken(
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<TokenRes>> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const { body: tokenResponse, version } = await this.withVersion(
      await this.api.v1Oauth2TokenPostRaw(
        {
          Tomo_API_Version: SDK_VERSION_PARAM,
          client_assertion: clientAssertion,
          client_assertion_type:
            'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
          grant_type: 'client_credentials',
          scope: 'idv.read',
          resource: `https://api.tomopayment.com/v1/idv`,
        },
        this.contractInit(selection),
      ),
    );

    this.setState('access_token', tokenResponse.access_token);
    this.setState('token_info', {
      clientId: TOMO_IDV_CLIENT_ID,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in,
      scope: tokenResponse.scope ?? null,
      issuedAt: new Date().toISOString(),
    });

    return { body: tokenResponse, version };
  }

  // ── Generic (country-agnostic) ──

  async idvStart(
    body: StartIdvReq,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<StartIdvRes>> {
    return this.withVersion(
      await this.api.v1IdvStartPostRaw(
        { Tomo_API_Version: SDK_VERSION_PARAM, StartIdvReq: body },
        this.contractInit(selection),
      ),
    );
  }

  async idvResult(
    body: ResultReq,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResultResponse> {
    // 재생성된 SDK 의 ResultRes 는 1.4 전용 oneOf 라, legacy 응답을 넣으면
    // 어느 쪽에도 매칭되지 않아 FromJSONTyped 가 {} 를 돌려준다 — 조용한 유실.
    // 그래서 역직렬화를 태우지 않고 wire 원문을 그대로 통과시킨다.
    const response = await this.api.v1IdvResultPostRaw(
      { Tomo_API_Version: SDK_VERSION_PARAM, ResultReq: body },
      this.contractInit(selection),
    );
    const text = await response.raw.text();
    return {
      body: this.parseUpstreamJson(text),
      version: this.appliedVersion(response.raw),
    };
  }

  private parseUpstreamJson(text: string): unknown {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async idvReset(
    body: ResetReq,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<ResetRes>> {
    return this.withVersion(
      await this.api.v1IdvResetPostRaw(
        { Tomo_API_Version: SDK_VERSION_PARAM, ResetReq: body },
        this.contractInit(selection),
      ),
    );
  }

  // delete 응답은 status enum 하나뿐인 단순 객체라 union 평탄화 문제가 없다.
  // result 와 달리 생성 SDK 역직렬화를 그대로 쓴다.
  async idvResultDelete(
    body: ResultDeleteReq,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<ResultDeleteRes>> {
    return this.withVersion(
      await this.api.v1IdvResultDeletePostRaw(
        { Tomo_API_Version: SDK_VERSION_PARAM, ResultDeleteReq: body },
        this.contractInit(selection),
      ),
    );
  }

  async idvResultBulkDelete(
    body: ResultBulkDeleteReq,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<ResultBulkDeleteRes>> {
    return this.withVersion(
      await this.api.v1IdvResultBulkDeletePostRaw(
        { Tomo_API_Version: SDK_VERSION_PARAM, ResultBulkDeleteReq: body },
        this.contractInit(selection),
      ),
    );
  }

  async proxyPost(
    path: string,
    body: unknown,
    selection: ContractSelection = DEFAULT_SELECTION,
  ): Promise<UpstreamResponse<unknown>> {
    const response = await fetch(`${this.resolveBaseUrl()}${path}`, {
      method: 'POST',
      headers: withContractHeaders(
        {
          Authorization: this.bearerToken(),
          'Content-Type': 'application/json',
        },
        selection,
      ),
      body: JSON.stringify(body ?? {}),
    });
    const contentType = response.headers.get('content-type') ?? undefined;
    const version = this.appliedVersion(response);
    const text = await response.text();

    if (!response.ok) {
      throw new UpstreamResponseError(
        response.status,
        text,
        contentType,
        version,
      );
    }

    const isJson = contentType?.toLowerCase().includes('application/json');
    return {
      body: isJson ? this.parseUpstreamJson(text) : text,
      version,
    };
  }

  private requireAccessToken(): string {
    const accessToken = this.getState('access_token') as unknown;
    if (typeof accessToken !== 'string' || !accessToken) {
      throw new Error(
        'No access token found. Please call /v1/oauth2/token first.',
      );
    }
    return accessToken;
  }

  private resolveBaseUrl(): string {
    const base =
      process.env.IDV_BASE_URL ??
      process.env.IDV_SERVER ??
      process.env.IDV_BASEURL ??
      'http://idv-server-ghci';
    return base.replace(/\/$/, '');
  }

  // ==================== State Management Methods ====================

  setState(key: string, value: any): void {
    this.stateService.set(key, value);
  }

  getState(key: string): any {
    return this.stateService.get(key);
  }

  hasState(key: string): boolean {
    return this.stateService.has(key);
  }

  deleteState(key: string): boolean {
    return this.stateService.delete(key);
  }

  getAllStates(): Record<string, any> {
    return this.stateService.getAll();
  }

  updateState(key: string, updater: (current: any) => any): void {
    this.stateService.update(key, updater);
  }

  incrementState(key: string, amount: number = 1): number {
    return this.stateService.increment(key, amount);
  }

  decrementState(key: string, amount: number = 1): number {
    return this.stateService.decrement(key, amount);
  }

  pushToState(key: string, value: any): void {
    this.stateService.push(key, value);
  }

  removeFromState(key: string, value: any): void {
    this.stateService.remove(key, value);
  }

  setStateProperty(key: string, property: string, value: any): void {
    this.stateService.setProperty(key, property, value);
  }

  removeStateProperty(key: string, property: string): void {
    this.stateService.removeProperty(key, property);
  }

  subscribeToState(key: string, callback: (value: any) => void): () => void {
    return this.stateService.subscribe(key, callback);
  }

  getStateCount(): number {
    return this.stateService.size();
  }

  getStateKeys(pattern?: string): string[] {
    return this.stateService.getKeys(pattern);
  }

  backupState(): string {
    return this.stateService.backup();
  }

  restoreState(backup: string): void {
    this.stateService.restore(backup);
  }

  clearAllStates(): void {
    this.stateService.clear();
  }
}
