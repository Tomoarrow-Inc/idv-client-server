import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { createClientAssertion, buildTokenRequest } from './sdk/tomo-idv-node';

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
  constructor(private readonly stateService: StateService) {

  }

  getHello(): string {
    return 'Hello World!';
  }

  async issueClientCredentialsTokenSdk(): Promise<IssueAccessTokenResult> {
    const baseUrl = this.resolveBaseUrl();

    const clientAssertion = createClientAssertion({
      client_id: TOMO_IDV_CLIENT_ID,
      secret_key: TOMO_IDV_SECRET,
      base_url: baseUrl,
    });

    const { headers, body } = buildTokenRequest(clientAssertion);

    const result = await this.safeFetchJson<TokenResponseBody>(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers,
      body,
    });

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

    return {
      clientId: TOMO_IDV_CLIENT_ID,
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in,
      scope,
    };
  }

  async getKycUS(user_id: string, fields?: string[]): Promise<any> {
    const baseUrl = this.resolveBaseUrl();
    
    // State에서 access_token 가져오기
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }

    // 요청 본문 구성
    // fields가 undefined면 fields를 포함하지 않음 (기본값)
    // fields가 빈 배열이거나 값이 있으면 fields를 포함
    const requestBody: { user_id: string; fields?: string[] } = {
      user_id: user_id,
      // date_of_birth ,email_address ,phone_number ,family_name ,given_name ,city ,country ,postal_code ,region ,street
      // fields: [ "date_of_birth" ,"email_address" ,"phone_number" ,"family_name" ,"given_name" ,"city" ,"country" ,"postal_code" ,"region" ,"street"]
      // fields: [ "date_of_birth" ,"email_address" ,"phone_number" ,"family_name" ,"city" ,"region" ]
      // fields: [] 
    };

    if (fields !== undefined) {
      requestBody.fields = fields;
    }

    const result = await this.safeFetchJson<any>(`${baseUrl}/v1/idv/us/kyc/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!result.ok) {
      throw new Error(`KYC request failed: ${result.status ?? 'unknown'} ${result.message}`);
    }

    return result.data;
  }

  async getKycJP(user_id: string, fields?: string[]): Promise<any> {
    const baseUrl = this.resolveBaseUrl();
    
    // State에서 access_token 가져오기
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }

    // 요청 본문 구성
    // fields가 undefined면 fields를 포함하지 않음 (기본값)
    // fields가 빈 배열이거나 값이 있으면 fields를 포함
    const requestBody: { user_id: string; fields?: string[] } = {
      user_id: user_id,
      // name, date_of_birth, sex, address, postal_code
      // fields: ["name", "date_of_birth", "sex", "address", "postal_code"]
      // fields: ["name", "date_of_birth", "postal_code"]
      // fields: []
    };

    if (fields !== undefined) {
      requestBody.fields = fields;
    }

    const result = await this.safeFetchJson<any>(`${baseUrl}/v1/idv/jp/kyc/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!result.ok) {
      throw new Error(`KYC request failed: ${result.status ?? 'unknown'} ${result.message}`);
    }

    return result.data;
  }

  async idvStartJP(user_id: string): Promise<any> {
    const baseUrl = this.resolveBaseUrl();
    
    // State에서 access_token 가져오기
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }

    // 하드코딩된 요청 본문
    const requestBody = {
      user_id: user_id,
      callback_url: "idvexpo://verify"
    };

    const result = await this.safeFetchJson<any>(`${baseUrl}/v1/idv/jp/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!result.ok) {
      throw new Error(`Applications request failed: ${result.status ?? 'unknown'} ${result.message}`);
    }

    return result.data;
  }

  async idvStartUS(user_id: string): Promise<any> {
    const baseUrl = this.resolveBaseUrl();
    
    // State에서 access_token 가져오기
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }

    // 하드코딩된 요청 본문
    const requestBody = {
      user_id: user_id,
      email: "chanhee@tomoarrow.com",
      callback_url: "idvexpo://verify"
    };

    const result = await this.safeFetchJson<any>(`${baseUrl}/v1/idv/us/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!result.ok) {
      throw new Error(`Link token request failed: ${result.status ?? 'unknown'} ${result.message}`);
    }

    return result.data;
  }

  async idvStart(user_id: string, callback_url: string, email: string, country: string): Promise<any> {
  // async idvStart(user_id: string, callback_url: string, email: string, country: string): Promise<any> {
    const baseUrl = this.resolveBaseUrl();
    
    // State에서 access_token 가져오기
    const accessToken = this.getState('access_token');
    if (!accessToken) {
      throw new Error('No access token found. Please call /access_token_sdk first.');
    }

    // 하드코딩된 요청 본문
    const requestBody = {
      user_id: user_id,
      email: email,
      callback_url: callback_url,
      country: country
    };

    const result = await this.safeFetchJson<any>(`${baseUrl}/v1/idv/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!result.ok) {
      throw new Error(`Link token request failed: ${result.status ?? 'unknown'} ${result.message}`);
    }

    return result.data;
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
