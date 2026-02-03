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
const idvServerClient_1 = require("./idvServer/idvServerClient");
const sdk_1 = require("./sdk");
const TOMO_IDV_CLIENT_ID = process.env.TOMO_IDV_CLIENT_ID;
const TOMO_IDV_SECRET = process.env.TOMO_IDV_SECRET;
let AppService = class AppService {
    stateService;
    idvServerClient;
    constructor(stateService, idvServerClient) {
        this.stateService = stateService;
        this.idvServerClient = idvServerClient;
    }
    getHello() {
        return 'Hello World!';
    }
    async issueClientCredentialsToken() {
        fetch('http://127.0.0.1:7243/ingest/203d449b-b9fb-4397-a200-2f7bfd7ddc4c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app.service.ts:issueClientCredentialsToken:entry', message: 'token endpoint entered', data: { stateHasAccessTokenBefore: this.hasState('access_token') }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'H1' }) }).catch(() => { });
        const baseUrl = this.resolveBaseUrl();
        const clientAssertion = (0, tomo_idv_node_1.createClientAssertion)({
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
        const accessToken = tokenResponse.access_token ?? tokenResponse.accessToken;
        const tokenType = tokenResponse.token_type ?? tokenResponse.tokenType;
        const expiresIn = tokenResponse.expires_in ?? tokenResponse.expiresIn;
        const scopeVal = tokenResponse.scope ?? null;
        this.setState('access_token', accessToken);
        this.setState('token_info', {
            clientId: TOMO_IDV_CLIENT_ID,
            tokenType: tokenType,
            expiresIn: expiresIn,
            scope: scopeVal,
            issuedAt: new Date().toISOString(),
        });
        fetch('http://127.0.0.1:7243/ingest/203d449b-b9fb-4397-a200-2f7bfd7ddc4c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app.service.ts:issueClientCredentialsToken:afterSetState', message: 'token stored in state', data: { stateHasAccessToken: this.hasState('access_token') }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'H1' }) }).catch(() => { });
        return (0, sdk_1.toSnakeCaseKeys)({
            clientId: TOMO_IDV_CLIENT_ID,
            accessToken: accessToken,
            tokenType: tokenType,
            expiresIn: expiresIn,
            scope: scopeVal,
        });
    }
    async getKycUS(body) {
        const accessToken = this.getState('access_token');
        fetch('http://127.0.0.1:7243/ingest/203d449b-b9fb-4397-a200-2f7bfd7ddc4c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app.service.ts:getKycUS', message: 'getState access_token', data: { accessTokenPresent: !!accessToken, stateKeys: this.getStateKeys() }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'H2' }) }).catch(() => { });
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        return this.idvServerClient.getKycUS(accessToken, body);
    }
    async getKycJP(body) {
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        return this.idvServerClient.getKycJP(accessToken, body);
    }
    async idvStartJP(body) {
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        return this.idvServerClient.idvStartJP(accessToken, body);
    }
    async idvStartUS(body) {
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        return this.idvServerClient.idvStartUS(accessToken, body);
    }
    async idvStart(body) {
        const accessToken = this.getState('access_token');
        if (!accessToken) {
            throw new Error('No access token found. Please call /access_token_sdk first.');
        }
        return this.idvServerClient.idvStart(accessToken, body);
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
    __metadata("design:paramtypes", [state_service_1.StateService,
        idvServerClient_1.IdvServerClient])
], AppService);
//# sourceMappingURL=app.service.js.map