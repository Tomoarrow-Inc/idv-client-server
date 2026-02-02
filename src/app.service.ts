import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion } from './sdk/tomo-idv-node';
import { IdvServerClient } from './idvServer/idvServerClient';

export type RegistrationResponseBody = {
  client_id: string;
};

export type TokenResponseBody = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  scopeGranted?: string;
};

type SafeFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; message: string };

export interface IssueAccessTokenResult {
  clientId: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string | null;
  claims?: Record<string, unknown>;
}

const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID as string;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET as string;

@Injectable()
export class AppService {
  constructor(
    private readonly stateService: StateService,
    private readonly idvServerClient: IdvServerClient
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    const baseUrl = this.resolveBaseUrl();
    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const tokenResponse = await this.idvServerClient.issueToken({
      clientAssertion,
      clientAssertionType: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grantType: 'client_credentials',
      scope: 'idv.read',
      resource: `https://api.tomopayment.com/v1/idv`,
    });

<<<<<<< HEAD
    if (!result.ok) {
      throw new Error(`Failed to issue client credentials token: ${result.status ?? 'unknown'} ${result.message}`);
    }

    const tokenResponse = result.data;
    const scope = tokenResponse.scope ?? tokenResponse.scopeGranted ?? null;

    this.setState('access_token', tokenResponse.access_token);
    this.setState('token_info', {
      clientId: TOMO_IDV_CLIENT_ID,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in,
      scope,
      issuedAt: new Date().toISOString(),
    });

=======
    const scope = tokenResponse.scopeGranted ?? null;
>>>>>>> 7e0dcf5 (OpenApi contract was applied)
    return {
      clientId: TOMO_IDV_CLIENT_ID,
      accessToken: tokenResponse.accessToken,
      tokenType: tokenResponse.tokenType,
      expiresIn: tokenResponse.expiresIn,
      scope,
    };
  }

  async getKycUS(user_id: string, _fields?: string[]): Promise<any> {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }
    return this.idvServerClient.getKycUS(accessToken, user_id);
  }

  async getKycJP(user_id: string, _fields?: string[]): Promise<any> {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }
    return this.idvServerClient.getKycJP(accessToken, user_id);
  }

  async idvStartJP(user_id: string, callback_url?: string): Promise<any> {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }
    return this.idvServerClient.idvStartJP(accessToken, user_id, callback_url ?? 'idvexpo://verify');
  }

  async idvStartUS(user_id: string, email?: string, callback_url?: string): Promise<any> {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }
    return this.idvServerClient.idvStartUS(
      accessToken,
      user_id,
      email ?? 'chanhee@tomoarrow.com',
      callback_url ?? 'idvexpo://verify'
    );
  }

  async idvStart(user_id: string, callback_url: string, email: string, country: string): Promise<any> {
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }
    return this.idvServerClient.idvStart(accessToken, user_id, callback_url, email, country);
  }

  async issueClientCredentialsTokenOld(): Promise<IssueAccessTokenResult> {
    try {
      const baseUrl = this.resolveBaseUrl();
      // const asPublicKey = this.resolveAuthorizationServerKey();

      console.log('baseUrl', baseUrl);

      // TODO:  SDK로 만들어줘야함 start ---
      
      // const clientKeys = this.generateEcP256();
      // const kid = this.computeJwkThumbprint(publicJwk);
      // console.log('kid', kid);
      
      // base64Url로 인코딩된 TOMO_IDV_SECRET를 JWK로 변환
      const privateJwk = this.decodeBase64UrlToJwk(TOMO_IDV_SECRET);
      const privateKey = createPrivateKey({ key: privateJwk, format: 'jwk' });

      const assertion = this.createClientAssertion(
        privateKey,
        TOMO_IDV_CLIENT_ID,
        `${baseUrl}/v1/oauth2/token`,
      );

      // SDK로 만들어줘야함 end ---

      const tokenResponse = await this.requestAccessToken(baseUrl, assertion);
      const scope = tokenResponse.scope ?? tokenResponse.scopeGranted ?? null;
      // const claims = this.verifyJwt(tokenResponse.access_token, createPublicKey({ key: publicJwk, format: 'jwk' }));

      const result = {
        clientId: TOMO_IDV_CLIENT_ID,
        accessToken: tokenResponse.access_token,
        tokenType: tokenResponse.token_type,
        expiresIn: tokenResponse.expires_in,
        scope,
        // claims,
      };

      // access_token을 State에 저장
      this.setState('access_token', tokenResponse.access_token);
      this.setState('token_info', {
        clientId: TOMO_IDV_CLIENT_ID,
        tokenType: tokenResponse.token_type,
        expiresIn: tokenResponse.expires_in,
        scope,
        issuedAt: new Date().toISOString()
      });

      return result;

    } catch (error) {
      throw new Error(`Failed to issue client credentials token: ${error}`);
    }
  }

  private resolveBaseUrl(): string {
    const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
    return base.replace(/\/$/, '');
  }

  private async safeFetchJson<T>(url: string, init?: RequestInit): Promise<SafeFetchResult<T>> {
    try {
      const response = await fetch(url, init);
      const text = await response.text();

      if (!response.ok) {
        return { ok: false, status: response.status, message: text || response.statusText };
      }

      try {
        return { ok: true, data: JSON.parse(text) as T };
      } catch {
        return { ok: false, status: response.status, message: 'Invalid JSON response' };
      }
    } catch (error) {
      return { ok: false, message: `Fetch failed: ${error}` };
    }
  }

  // ==================== State Management Methods ====================

  /**
   * State 값 설정
   */
  setState(key: string, value: any): void {
    this.stateService.set(key, value);
  }

  /**
   * State 값 조회
   */
  getState(key: string): any {
    return this.stateService.get(key);
  }

  /**
   * State 값이 존재하는지 확인
   */
  hasState(key: string): boolean {
    return this.stateService.has(key);
  }

  /**
   * State 값 삭제
   */
  deleteState(key: string): boolean {
    return this.stateService.delete(key);
  }

  /**
   * 모든 State 조회
   */
  getAllStates(): Record<string, any> {
    return this.stateService.getAll();
  }

  /**
   * State 값 업데이트
   */
  updateState(key: string, updater: (current: any) => any): void {
    this.stateService.update(key, updater);
  }

  /**
   * State 값 증가
   */
  incrementState(key: string, amount: number = 1): number {
    return this.stateService.increment(key, amount);
  }

  /**
   * State 값 감소
   */
  decrementState(key: string, amount: number = 1): number {
    return this.stateService.decrement(key, amount);
  }

  /**
   * 배열에 값 추가
   */
  pushToState(key: string, value: any): void {
    this.stateService.push(key, value);
  }

  /**
   * 배열에서 값 제거
   */
  removeFromState(key: string, value: any): void {
    this.stateService.remove(key, value);
  }

  /**
   * 객체에 속성 추가/업데이트
   */
  setStateProperty(key: string, property: string, value: any): void {
    this.stateService.setProperty(key, property, value);
  }

  /**
   * 객체에서 속성 제거
   */
  removeStateProperty(key: string, property: string): void {
    this.stateService.removeProperty(key, property);
  }

  /**
   * State 변경 리스너 등록
   */
  subscribeToState(key: string, callback: (value: any) => void): () => void {
    return this.stateService.subscribe(key, callback);
  }

  /**
   * State 개수 조회
   */
  getStateCount(): number {
    return this.stateService.size();
  }

  /**
   * 특정 패턴과 일치하는 키들 조회
   */
  getStateKeys(pattern?: string): string[] {
    return this.stateService.getKeys(pattern);
  }

  /**
   * State 백업
   */
  backupState(): string {
    return this.stateService.backup();
  }

  /**
   * State 복원
   */
  restoreState(backup: string): void {
    this.stateService.restore(backup);
  }

  /**
   * 모든 State 삭제
   */
  clearAllStates(): void {
    this.stateService.clear();
  }
}
