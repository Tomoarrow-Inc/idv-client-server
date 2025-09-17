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

export interface IssueAccessTokenResult {
  clientId: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string | null;
  claims: Record<string, unknown>;
}

interface EcKeyPair {
  publicKey: KeyObject;
  privateKey: KeyObject;
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
}


const TOMO_IDV_CLIENT_ID = 'tomo-idv-client';
const publicJwk: JsonWebKey = {
  "kty": "EC",
  "x": "e7JBRpkaXzTsCij57UMYlDFrof2cDTWXdrhEfrwXgzE",
  "y": "aEMPbkQJjBsK7KBXZabWL1T8eKUjZqhEZVXdwlomdwU",
  "crv": "P-256"
};

const TOMO_IDV_SECRET: JsonWebKey = {
  "kty": "EC",
  "x": "e7JBRpkaXzTsCij57UMYlDFrof2cDTWXdrhEfrwXgzE",
  "y": "aEMPbkQJjBsK7KBXZabWL1T8eKUjZqhEZVXdwlomdwU",
  "crv": "P-256",
  "d": "gggGIeDCXmttfwOGw1i5fGlTTl-nTcoFugbn3aq3xCw"
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async issueClientCredentialsToken(): Promise<IssueAccessTokenResult> {
    try {
      const baseUrl = this.resolveBaseUrl();
      // const asPublicKey = this.resolveAuthorizationServerKey();

      // const clientKeys = this.generateEcP256();
      const kid = this.computeJwkThumbprint(publicJwk);
      console.log('kid', kid);

      const assertion = this.createClientAssertion(
        createPrivateKey({ key: TOMO_IDV_SECRET, format: 'jwk' }),
        TOMO_IDV_CLIENT_ID,
        `${baseUrl}/oauth2/token`,
      );

      const tokenResponse = await this.requestAccessToken(baseUrl, assertion);
      const scope = tokenResponse.scope ?? tokenResponse.scopeGranted ?? null;
      const claims = this.verifyJwt(tokenResponse.access_token, createPublicKey({ key: publicJwk, format: 'jwk' }));

      return {
        clientId: TOMO_IDV_CLIENT_ID,
        accessToken: tokenResponse.access_token,
        tokenType: tokenResponse.token_type,
        expiresIn: tokenResponse.expires_in,
        scope,
        claims,
      };

    } catch (error) {
      throw new Error(`Failed to issue client credentials token: ${error}`);
    }
  }

  private resolveBaseUrl(): string {
    const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
    return base.replace(/\/$/, '');
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

  private createClientAssertion(privateKey: KeyObject, clientId: string, audience: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientId,
      sub: clientId,
      aud: audience,
      iat: now,
      exp: now + 300,
      jti: 'test-jti-1',
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

    try {
      const response = await fetch(`${baseUrl}/v1/admin/clients`, {
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

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to register client (${response.status}): ${text}`);
      }

      const json = (await response.json()) as RegistrationResponseBody;
      if (!json.client_id) {
        throw new Error('registerClient response missing client_id');
      }
      return json.client_id;

    } catch (error) {
      throw new Error(`Failed to register client: ${error}`);
    }
  }

  private async requestAccessToken(baseUrl: string, assertion: string): Promise<TokenResponseBody> {
    try {
      console.log('requestAccessToken', baseUrl, assertion);
      const params = new URLSearchParams();
      params.set('grant_type', 'client_credentials');
      params.set('scope', 'idv.read');
      params.set('resource', baseUrl);
      params.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
      params.set('client_assertion', assertion);

      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          DPoP: 'dpop-proof',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to issue access token (${response.status}): ${text}`);
      }

      return (await response.json()) as TokenResponseBody;

    } catch (error) {
      throw new Error(`Failed to request access token: ${error}`);
    }
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
}
