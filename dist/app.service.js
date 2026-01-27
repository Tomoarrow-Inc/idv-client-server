"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const state_service_1 = require("./state.service");
const tomo_idv_node_1 = require("./sdk/tomo-idv-node");
const api_1 = require("./contract/api");
const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET;
let AppService = class AppService {
    stateService;
    constructor(stateService) {
        this.stateService = stateService;
    }
    getHello() {
        return 'Hello World!';
    }
    async issueClientCredentialsToken() {
        const baseUrl = this.resolveBaseUrl();
        const clientAssertion = (0, tomo_idv_node_1.createClientAssertion)({
            client_id: TOMO_IDV_CLIENT_ID,
            secret_key: TOMO_IDV_SECRET,
            base_url: baseUrl,
        });
        const { headers, body } = (0, tomo_idv_node_1.buildTokenRequest)(clientAssertion);
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.access_token.path}`, {
            method: api_1.contract.access_token.method,
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
    async getKycUS(user_id, fields) {
        const baseUrl = this.resolveBaseUrl();
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        const requestBody = {
            user_id: user_id,
        };
        if (fields !== undefined) {
            requestBody.fields = fields;
        }
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.idv_us_get_result.path}`, {
            method: api_1.contract.idv_us_get_result.method,
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
    async getKycJP(user_id, fields) {
        const baseUrl = this.resolveBaseUrl();
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        const requestBody = {
            user_id: user_id,
        };
        if (fields !== undefined) {
            requestBody.fields = fields;
        }
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.idv_jp_get_result.path}`, {
            method: api_1.contract.idv_jp_get_result.method,
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
    async idvStartJP(user_id, callback_url) {
        const baseUrl = this.resolveBaseUrl();
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        const requestBody = {
            user_id: user_id,
            callback_url: callback_url ?? "idvexpo://verify"
        };
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.idv_jp_start.path}`, {
            method: api_1.contract.idv_jp_start.method,
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
    async idvStartUS(user_id, email, callback_url) {
        const baseUrl = this.resolveBaseUrl();
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        const requestBody = {
            user_id: user_id,
            email: email ?? "chanhee@tomoarrow.com",
            callback_url: callback_url ?? "idvexpo://verify"
        };
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.idv_us_start.path}`, {
            method: api_1.contract.idv_us_start.method,
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
    async idvStart(user_id, callback_url, email, country) {
        const baseUrl = this.resolveBaseUrl();
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        const requestBody = {
            user_id: user_id,
            email: email,
            callback_url: callback_url,
            country: country
        };
        const result = await this.safeFetchJson(`${baseUrl}${api_1.contract.idv_start.path}`, {
            method: api_1.contract.idv_start.method,
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
    async issueClientCredentialsTokenOld() {
        try {
            const baseUrl = this.resolveBaseUrl();
            console.log('baseUrl', baseUrl);
            const privateJwk = this.decodeBase64UrlToJwk(TOMO_IDV_SECRET);
            const privateKey = createPrivateKey({ key: privateJwk, format: 'jwk' });
            const assertion = this.createClientAssertion(privateKey, TOMO_IDV_CLIENT_ID, `${baseUrl}/v1/oauth2/token`);
            const tokenResponse = await this.requestAccessToken(baseUrl, assertion);
            const scope = tokenResponse.scope ?? tokenResponse.scopeGranted ?? null;
            const result = {
                clientId: TOMO_IDV_CLIENT_ID,
                accessToken: tokenResponse.access_token,
                tokenType: tokenResponse.token_type,
                expiresIn: tokenResponse.expires_in,
                scope,
            };
            this.setState('access_token', tokenResponse.access_token);
            this.setState('token_info', {
                clientId: TOMO_IDV_CLIENT_ID,
                tokenType: tokenResponse.token_type,
                expiresIn: tokenResponse.expires_in,
                scope,
                issuedAt: new Date().toISOString()
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to issue client credentials token: ${error}`);
        }
    }
    resolveBaseUrl() {
        const base = process.env.IDV_BASE_URL ?? 'http://idv-server-ghci';
        return base.replace(/\/$/, '');
    }
    async safeFetchJson(url, init) {
        try {
            const response = await fetch(url, init);
            const text = await response.text();
            if (!response.ok) {
                return { ok: false, status: response.status, message: text || response.statusText };
            }
            try {
                return { ok: true, data: JSON.parse(text) };
            }
            catch {
                return { ok: false, status: response.status, message: 'Invalid JSON response' };
            }
        }
        catch (error) {
            return { ok: false, message: `Fetch failed: ${error}` };
        }
    }
    setState(key, value) {
        this.stateService.set(key, value);
    }
    getState(key) {
        return this.stateService.get(key);
    }
    hasState(key) {
        return this.stateService.has(key);
    }
    deleteState(key) {
        return this.stateService.delete(key);
    }
    getAllStates() {
        return this.stateService.getAll();
    }
    updateState(key, updater) {
        this.stateService.update(key, updater);
    }
    incrementState(key, amount = 1) {
        return this.stateService.increment(key, amount);
    }
    decrementState(key, amount = 1) {
        return this.stateService.decrement(key, amount);
    }
    pushToState(key, value) {
        this.stateService.push(key, value);
    }
    removeFromState(key, value) {
        this.stateService.remove(key, value);
    }
    setStateProperty(key, property, value) {
        this.stateService.setProperty(key, property, value);
    }
    removeStateProperty(key, property) {
        this.stateService.removeProperty(key, property);
    }
    subscribeToState(key, callback) {
        return this.stateService.subscribe(key, callback);
    }
    getStateCount() {
        return this.stateService.size();
    }
    getStateKeys(pattern) {
        return this.stateService.getKeys(pattern);
    }
    backupState() {
        return this.stateService.backup();
    }
    restoreState(backup) {
        this.stateService.restore(backup);
    }
    clearAllStates() {
        this.stateService.clear();
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [state_service_1.StateService])
], AppService);
//# sourceMappingURL=app.service.js.map