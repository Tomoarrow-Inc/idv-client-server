import {
  createSign,
  createPrivateKey,
  KeyObject,
  JsonWebKey,
  randomUUID,
} from 'node:crypto';



export type ClientAssertionOptions = {
  client_id: string;
  secret_key: string;
  base_url: string;
}

export type BodyOptions = {
  grant_type?: string;
  scope?: string;
  resource?: string;
  client_assertion_type?: string;
}

export function createClientAssertion(options: ClientAssertionOptions): string {
  const privateJwk = decodeBase64UrlToJwk(options.secret_key);
  const privateKey = createPrivateKey({ key: privateJwk, format: 'jwk' });

  const now = Math.floor(Date.now() / 1000);
  const jti = randomUUID();
  const payload = {
    iss: options.client_id,
    sub: options.client_id,
    aud: `${options.base_url}/v1/oauth2/token`,
    iat: now,
    exp: now + 300,
    jti: jti,
  };
  return signJwt(privateKey, payload);
}


export function buildTokenRequest(client_assertion: string, options: BodyOptions={}): { headers: Record<string, string>, body: string } {

  const { grant_type, scope, resource, client_assertion_type } = options;

  const params = new URLSearchParams();
  params.set('grant_type', grant_type ?? 'client_credentials');
  params.set('scope', scope ?? 'idv.read');
  params.set('resource', resource ?? `https://api.tomopayment.com/v1/idv`);
  params.set('client_assertion_type', client_assertion_type ?? 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
  params.set('client_assertion', client_assertion);
  const body = params.toString();

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return { headers, body }
}




function signJwt(privateKey: KeyObject, payload: Record<string, unknown>): string {
  const header = base64UrlEncode(Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })));
  const body = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${header}.${body}`;
  const signer = createSign('sha256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });
  const encodedSignature = base64UrlEncode(signature);
  return `${signingInput}.${encodedSignature}`;
}

function decodeBase64UrlToJwk(encodedJwk: string): JsonWebKey {
  try {
    const decoded = base64UrlDecode(encodedJwk);
    const jwk = JSON.parse(decoded.toString('utf8')) as JsonWebKey;
    return jwk;
  } catch (error) {
    throw new Error(`Failed to decode base64url JWK: ${error}`);
  }
}

function base64UrlDecode(str: string): Buffer {
  // base64url을 base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가 (필요한 경우)
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return Buffer.from(base64, 'base64');
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

