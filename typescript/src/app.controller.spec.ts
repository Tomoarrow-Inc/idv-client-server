import { createHash, createPublicKey, createSign, createVerify, generateKeyPairSync, KeyObject } from 'node:crypto';

type RegistrationResponseBody = {
  client_id: string;
};

type TokenResponseBody = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  scopeGranted?: string;
};

interface EcKeyPair {
  publicKey: KeyObject;
  privateKey: KeyObject;
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
}

const shouldRunIntegration = process.env.RUN_IDV_INTEGRATION_TESTS === 'true';
const baseUrl = (process.env.IDV_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const describeIfEnabled = shouldRunIntegration ? describe : describe.skip;

// Exercise the IDV OAuth2 token endpoint using the same flow as the Haskell spec.
describeIfEnabled('+/oauth2/token (private_key_jwt)', () => {
  it(
    'issues access token for valid client_assertion and DPoP',
    async () => {
      const asJwkEnv = process.env.AS_SIGNING_JWK;
      if (!asJwkEnv) {
        throw new Error('AS_SIGNING_JWK env var must be set to verify access token signature');
      }
      const asPublicKey = createPublicKey({ key: JSON.parse(asJwkEnv) as JsonWebKey, format: 'jwk' });

      const clientKeys = generateEcP256();
      const kid = computeJwkThumbprint(clientKeys.publicJwk);
      const clientId = await registerClient(baseUrl, kid, clientKeys.publicJwk);

      const audience = `${baseUrl}/oauth2/token`;
      const assertion = createClientAssertion(clientKeys.privateKey, clientId, audience);

      const tokenResponse = await requestAccessToken(baseUrl, assertion);
      expect(tokenResponse.token_type).toBe('Bearer');
      const grantedScope = tokenResponse.scope ?? tokenResponse.scopeGranted;
      expect(grantedScope).toBe('idv.read');

      const payload = verifyJwt(tokenResponse.access_token, asPublicKey);
      expect(payload.sub).toBe(clientId);
      expect(payload.scope).toBe('idv.read');
    },
    20000,
  );
});

function generateEcP256(): EcKeyPair {
  const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const publicJwk = publicKey.export({ format: 'jwk' }) as JsonWebKey;
  const privateJwk = privateKey.export({ format: 'jwk' }) as JsonWebKey;
  return { publicKey, privateKey, publicJwk, privateJwk };
}

function computeJwkThumbprint(jwk: JsonWebKey): string {
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256' || !jwk.x || !jwk.y) {
    throw new Error('Expected EC P-256 JWK');
  }
  const canonical = `{"crv":"P-256","kty":"EC","x":"${jwk.x}","y":"${jwk.y}"}`;
  const digest = createHash('sha256').update(canonical).digest();
  return base64UrlEncode(digest);
}

function base64UrlEncode(input: Buffer): string {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

function createClientAssertion(privateKey: KeyObject, clientId: string, audience: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientId,
    sub: clientId,
    aud: audience,
    iat: now,
    exp: now + 300,
    jti: 'test-jti-1',
  };
  return signJwt(privateKey, payload);
}

function signJwt(privateKey: KeyObject, payload: Record<string, unknown>): string {
  const header = base64UrlEncode(Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })));
  const claims = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${header}.${claims}`;
  const signer = createSign('sha256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });
  const signatureEncoded = base64UrlEncode(signature);
  return `${signingInput}.${signatureEncoded}`;
}

async function registerClient(base: string, kid: string, jwk: JsonWebKey): Promise<string> {
  if (!jwk.x || !jwk.y) {
    throw new Error('JWK missing coordinates');
  }
  const registerUrl = `${base}/v1/admin/clients`;
  const body = {
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
  };

  const response = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ssa-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
}

async function requestAccessToken(base: string, assertion: string): Promise<TokenResponseBody> {
  const tokenUrl = `${base}/v1/oauth2/token`;
  const params = new URLSearchParams();
  params.set('grant_type', 'client_credentials');
  params.set('scope', 'idv.read');
  params.set('resource', base);
  params.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
  params.set('client_assertion', assertion);

  const response = await fetch(tokenUrl, {
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
}

function verifyJwt(token: string, publicKey: KeyObject) {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    throw new Error('Malformed JWT');
  }

  const signingInput = `${header}.${payload}`;
  const verifier = createVerify('sha256');
  verifier.update(signingInput);
  verifier.end();
  const isValid = verifier.verify(
    { key: publicKey, dsaEncoding: 'ieee-p1363' },
    Buffer.from(signature, 'base64url'),
  );

  if (!isValid) {
    throw new Error('Access token signature verification failed');
  }

  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
    sub?: string;
    scope?: string;
    [key: string]: unknown;
  };
}
