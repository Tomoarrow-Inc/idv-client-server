"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientAssertion = createClientAssertion;
exports.buildTokenRequest = buildTokenRequest;
const node_crypto_1 = require("node:crypto");
function createClientAssertion(options) {
    const privateJwk = decodeBase64UrlToJwk(options.secret_key);
    const privateKey = (0, node_crypto_1.createPrivateKey)({ key: privateJwk, format: 'jwk' });
    const now = Math.floor(Date.now() / 1000);
    const jti = (0, node_crypto_1.randomUUID)();
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
function buildTokenRequest(client_assertion, options = {}) {
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
    };
    return { headers, body };
}
function signJwt(privateKey, payload) {
    const header = base64UrlEncode(Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })));
    const body = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
    const signingInput = `${header}.${body}`;
    const signer = (0, node_crypto_1.createSign)('sha256');
    signer.update(signingInput);
    signer.end();
    const signature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });
    const encodedSignature = base64UrlEncode(signature);
    return `${signingInput}.${encodedSignature}`;
}
function decodeBase64UrlToJwk(encodedJwk) {
    try {
        const decoded = base64UrlDecode(encodedJwk);
        const jwk = JSON.parse(decoded.toString('utf8'));
        return jwk;
    }
    catch (error) {
        throw new Error(`Failed to decode base64url JWK: ${error}`);
    }
}
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64');
}
function base64UrlEncode(buffer) {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/u, '');
}
//# sourceMappingURL=tomo-idv-node.js.map