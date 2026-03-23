import { generateKeyPairSync, createVerify, createPublicKey, generateKeySync } from 'node:crypto';
import { createClientAssertion, buildTokenRequest } from 'tomo-idv-client-node';

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function base64UrlDecode(str: string): Buffer {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

function makeSecretKey(): { secretKey: string; publicKeyPem: string } {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const jwk = privateKey.export({ format: 'jwk' });
  const encoded = base64UrlEncode(Buffer.from(JSON.stringify(jwk)));
  const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
  return { secretKey: encoded, publicKeyPem };
}

const CLIENT_ID = 'test-client-id';
const BASE_URL = 'https://api.tomopayment.com';

describe('tomo-idv-client-node SDK', () => {
  const { secretKey, publicKeyPem } = makeSecretKey();
  const options = { client_id: CLIENT_ID, secret_key: secretKey, base_url: BASE_URL };

  describe('A. JWT 구조 검증 (createClientAssertion)', () => {
    let jwt: string;
    let parts: string[];

    beforeAll(() => {
      jwt = createClientAssertion(options);
      parts = jwt.split('.');
    });

    it('1. JWT 3-part 구조', () => {
      expect(parts).toHaveLength(3);
    });

    it('2. 각 파트 valid base64url', () => {
      for (const part of parts) {
        expect(part).not.toMatch(/[+/=]/);
      }
    });

    it('3. Header 정확성', () => {
      const header = JSON.parse(base64UrlDecode(parts[0]).toString('utf8'));
      expect(header).toEqual({ alg: 'ES256', typ: 'JWT' });
    });

    it('4. Payload claims (iss === sub === client_id)', () => {
      const payload = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
      expect(payload.iss).toBe(CLIENT_ID);
      expect(payload.sub).toBe(CLIENT_ID);
    });

    it('5. Audience', () => {
      const payload = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
      expect(payload.aud).toBe(`${BASE_URL}/v1/oauth2/token`);
    });

    it('6. 시간 claims (iat ≈ now, exp === iat + 300)', () => {
      const payload = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
      const now = Math.floor(Date.now() / 1000);
      expect(Math.abs(payload.iat - now)).toBeLessThanOrEqual(2);
      expect(payload.exp).toBe(payload.iat + 300);
    });

    it('7. JTI uniqueness', () => {
      const jwt1 = createClientAssertion(options);
      const jwt2 = createClientAssertion(options);
      const jti1 = JSON.parse(base64UrlDecode(jwt1.split('.')[1]).toString('utf8')).jti;
      const jti2 = JSON.parse(base64UrlDecode(jwt2.split('.')[1]).toString('utf8')).jti;
      expect(jti1).not.toBe(jti2);
      // UUID format
      expect(jti1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe('B. ES256 서명 검증', () => {
    it('8. 서명 검증 성공', () => {
      const jwt = createClientAssertion(options);
      const parts = jwt.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const signature = base64UrlDecode(parts[2]);

      const verifier = createVerify('sha256');
      verifier.update(signingInput);
      const isValid = verifier.verify(
        { key: publicKeyPem, dsaEncoding: 'ieee-p1363' },
        signature,
      );
      expect(isValid).toBe(true);
    });

    it('9. 다른 키로 검증 실패', () => {
      const jwt = createClientAssertion(options);
      const parts = jwt.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const signature = base64UrlDecode(parts[2]);

      const { publicKey: otherPublicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
      const otherPem = otherPublicKey.export({ type: 'spki', format: 'pem' }) as string;

      const verifier = createVerify('sha256');
      verifier.update(signingInput);
      const isValid = verifier.verify(
        { key: otherPem, dsaEncoding: 'ieee-p1363' },
        signature,
      );
      expect(isValid).toBe(false);
    });
  });

  describe('C. buildTokenRequest 검증', () => {
    it('10. Content-Type 헤더', () => {
      const { headers } = buildTokenRequest('dummy-jwt');
      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    });

    it('11. 기본값 검증', () => {
      const { body } = buildTokenRequest('dummy-jwt');
      const params = new URLSearchParams(body);
      expect(params.get('grant_type')).toBe('client_credentials');
      expect(params.get('scope')).toBe('idv.read');
      expect(params.get('resource')).toBe('https://api.tomopayment.com/v1/idv');
      expect(params.get('client_assertion_type')).toBe('urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    });

    it('12. client_assertion 전달', () => {
      const testJwt = 'header.payload.signature';
      const { body } = buildTokenRequest(testJwt);
      const params = new URLSearchParams(body);
      expect(params.get('client_assertion')).toBe(testJwt);
    });

    it('13. 커스텀 옵션 오버라이드', () => {
      const { body } = buildTokenRequest('dummy-jwt', {
        grant_type: 'custom_grant',
        scope: 'custom.scope',
        resource: 'https://custom.example.com/resource',
        client_assertion_type: 'custom-type',
      });
      const params = new URLSearchParams(body);
      expect(params.get('grant_type')).toBe('custom_grant');
      expect(params.get('scope')).toBe('custom.scope');
      expect(params.get('resource')).toBe('https://custom.example.com/resource');
      expect(params.get('client_assertion_type')).toBe('custom-type');
    });
  });

  describe('D. 에러 처리', () => {
    it('14. 잘못된 base64url 키', () => {
      expect(() =>
        createClientAssertion({ client_id: 'x', secret_key: '!!!invalid!!!', base_url: 'http://localhost' }),
      ).toThrow('Failed to decode base64url JWK');
    });

    it('15. 유효한 base64url이지만 EC 키가 아님', () => {
      const rsaJwk = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const encoded = base64UrlEncode(Buffer.from(JSON.stringify(rsaJwk)));
      expect(() =>
        createClientAssertion({ client_id: 'x', secret_key: encoded, base_url: 'http://localhost' }),
      ).toThrow();
    });
  });

  describe('E. idv-server 호환성 검증', () => {
    it('16. 전체 플로우 시뮬레이션', () => {
      // Step 1: createClientAssertion
      const jwt = createClientAssertion(options);

      // Step 2: buildTokenRequest
      const { headers, body } = buildTokenRequest(jwt);

      // Step 3: body 파싱
      const params = new URLSearchParams(body);
      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      expect(params.get('grant_type')).toBe('client_credentials');
      expect(params.get('client_assertion_type')).toBe('urn:ietf:params:oauth:client-assertion-type:jwt-bearer');

      // Step 4: JWT 추출
      const extractedJwt = params.get('client_assertion')!;
      expect(extractedJwt).toBe(jwt);

      // Step 5: 서명 검증
      const jwtParts = extractedJwt.split('.');
      expect(jwtParts).toHaveLength(3);
      const signingInput = `${jwtParts[0]}.${jwtParts[1]}`;
      const signature = base64UrlDecode(jwtParts[2]);

      const verifier = createVerify('sha256');
      verifier.update(signingInput);
      const isValid = verifier.verify(
        { key: publicKeyPem, dsaEncoding: 'ieee-p1363' },
        signature,
      );
      expect(isValid).toBe(true);

      // Step 6: claims 검증
      const payload = JSON.parse(base64UrlDecode(jwtParts[1]).toString('utf8'));
      expect(payload.iss).toBe(CLIENT_ID);
      expect(payload.sub).toBe(CLIENT_ID);
      expect(payload.aud).toBe(`${BASE_URL}/v1/oauth2/token`);
      expect(payload.exp).toBe(payload.iat + 300);
    });
  });
});
