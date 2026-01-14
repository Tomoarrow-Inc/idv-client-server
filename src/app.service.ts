import { Injectable } from '@nestjs/common';
import {
  createHash,
  createPublicKey,
  createSign,
  createVerify,
  createPrivateKey,
  generateKeyPairSync,
  KeyObject,
  JsonWebKey,
} from 'node:crypto';
import { StateService } from './state.service';
import { createClientAssertion, buildTokenRequest } from './sdk/tomo-idv-node';

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

interface EcKeyPair {
  publicKey: KeyObject;
  privateKey: KeyObject;
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
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
      throw new Error('No access token found. Please call /issueClientCredentialsToken first.');
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
      throw new Error('No access token found. Please call /issueClientCredentialsToken first.');
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
      throw new Error('No access token found. Please call /issueClientCredentialsToken first.');
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
      throw new Error('No access token found. Please call /issueClientCredentialsToken first.');
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
      throw new Error('No access token found. Please call /issueClientCredentialsToken first.');
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

  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
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

  private resolveAuthorizationServerKey(): KeyObject {
    const raw = process.env.AS_SIGNING_JWK;
    if (!raw) {
      throw new Error('AS_SIGNING_JWK env var must be set to verify access tokens');
    }

    let jwk: JsonWebKey;
    try {
      jwk = JSON.parse(raw) as JsonWebKey;
    } catch (error) {
      throw new Error('AS_SIGNING_JWK must contain valid JWK JSON');
    }

    return createPublicKey({ key: jwk, format: 'jwk' });
  }

  private generateEcP256(): EcKeyPair {
    const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    const publicJwk = publicKey.export({ format: 'jwk' }) as JsonWebKey;
    const privateJwk = privateKey.export({ format: 'jwk' }) as JsonWebKey;
    return { publicKey, privateKey, publicJwk, privateJwk };
  }

  private computeJwkThumbprint(jwk: JsonWebKey): string {
    if (jwk.kty !== 'EC' || jwk.crv !== 'P-256' || !jwk.x || !jwk.y) {
      throw new Error('Expected EC P-256 public JWK');
    }
    const canonical = `{"crv":"P-256","kty":"EC","x":"${jwk.x}","y":"${jwk.y}"}`;
    const digest = createHash('sha256').update(canonical).digest();
    return this.base64UrlEncode(digest);
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/u, '');
  }

  private base64UrlDecode(str: string): Buffer {
    // base64url을 base64로 변환
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 패딩 추가 (필요한 경우)
    while (base64.length % 4) {
      base64 += '=';
    }
    
    return Buffer.from(base64, 'base64');
  }

  private decodeBase64UrlToJwk(encodedJwk: string): JsonWebKey {
    try {
      const decoded = this.base64UrlDecode(encodedJwk);
      const jwk = JSON.parse(decoded.toString('utf8')) as JsonWebKey;
      return jwk;
    } catch (error) {
      throw new Error(`Failed to decode base64url JWK: ${error}`);
    }
  }

  private createClientAssertion(privateKey: KeyObject, clientId: string, audience: string): string {
    const now = Math.floor(Date.now() / 1000);
    const jti = crypto.randomUUID();
    const payload = {
      iss: clientId,
      sub: clientId,
      aud: audience,
      iat: now,
      exp: now + 300,
      jti: jti,
    };
    return this.signJwt(privateKey, payload);
  }

  private signJwt(privateKey: KeyObject, payload: Record<string, unknown>): string {
    const header = this.base64UrlEncode(Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })));
    const body = this.base64UrlEncode(Buffer.from(JSON.stringify(payload)));
    const signingInput = `${header}.${body}`;
    const signer = createSign('sha256');
    signer.update(signingInput);
    signer.end();
    const signature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });
    const encodedSignature = this.base64UrlEncode(signature);
    return `${signingInput}.${encodedSignature}`;
  }

  private async registerClient(baseUrl: string, kid: string, jwk: JsonWebKey): Promise<string> {
    if (!jwk.x || !jwk.y) {
      throw new Error('Public JWK missing EC coordinates');
    }

    const result = await this.safeFetchJson<RegistrationResponseBody>(`${baseUrl}/v1/admin/clients`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ssa-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwks: {
          keys: [
            {
              kty: 'EC',
              crv: 'P-256',
              x: jwk.x,
              y: jwk.y,
              kid,
              alg: 'ES256',
              use: 'sig',
            },
          ],
        },
        kid,
        client_metadata: null,
      }),
    });

    if (!result.ok) {
      throw new Error(`Failed to register client (${result.status ?? 'unknown'}): ${result.message}`);
    }

    const json = result.data;
    if (!json.client_id) {
      throw new Error('registerClient response missing client_id');
    }
    return json.client_id;
  }

  private async requestAccessToken(baseUrl: string, assertion: string): Promise<TokenResponseBody> {
    const params = new URLSearchParams();
    params.set('grant_type', 'client_credentials');
    params.set('scope', 'idv.read');
    params.set('resource', baseUrl);
    params.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    params.set('client_assertion', assertion);
    
    // TODO: SDK로 assertion 만 만들어주는걸로 하기

    const result = await this.safeFetchJson<TokenResponseBody>(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        DPoP: 'dpop-proof',
      },
      body: params.toString(),
    });

    if (!result.ok) {
      throw new Error(`Failed to issue access token (${result.status ?? 'unknown'}): ${result.message}`);
    }

    return result.data;
  }

  private verifyJwt(token: string, publicKey: KeyObject): Record<string, unknown> {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      throw new Error('Malformed JWT');
    }

    const signingInput = `${header}.${payload}`;
    const verifier = createVerify('sha256');
    verifier.update(signingInput);
    verifier.end();

    const signatureValid = verifier.verify(
      { key: publicKey, dsaEncoding: 'ieee-p1363' },
      Buffer.from(signature, 'base64url'),
    );

    if (!signatureValid) {
      throw new Error('Access token signature verification failed');
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
    return decoded;
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
