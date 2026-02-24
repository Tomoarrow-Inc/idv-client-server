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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const runtime_1 = require("./sdk/generated/runtime");
async function rethrow(error) {
    if (error instanceof runtime_1.ResponseError) {
        const status = error.response.status || common_1.HttpStatus.BAD_GATEWAY;
        let body;
        try {
            body = await error.response.text();
        }
        catch { }
        throw new common_1.HttpException({ statusCode: status, message: body || error.message }, status);
    }
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new common_1.HttpException(msg, common_1.HttpStatus.BAD_GATEWAY);
}
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async issueClientCredentialsToken() {
        try {
            return await this.appService.issueClientCredentialsToken();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStart(body) {
        try {
            return await this.appService.idvStart(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvKycGet(body) {
        try {
            return await this.appService.idvKycGet(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStartUS(body) {
        try {
            return await this.appService.idvStartUS(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async getKycUS(body) {
        try {
            return await this.appService.getKycUS(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async putKycUS(body) {
        try {
            return await this.appService.putKycUS(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvCookieStartUS(body) {
        try {
            return await this.appService.idvCookieStartUS(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async healthUS() {
        try {
            return await this.appService.healthUS();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStartUK(body) {
        try {
            return await this.appService.idvStartUK(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async getKycUK(body) {
        try {
            return await this.appService.getKycUK(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async putKycUK(body) {
        try {
            return await this.appService.putKycUK(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvCookieStartUK(body) {
        try {
            return await this.appService.idvCookieStartUK(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async healthUK() {
        try {
            return await this.appService.healthUK();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStartCA(body) {
        try {
            return await this.appService.idvStartCA(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async getKycCA(body) {
        try {
            return await this.appService.getKycCA(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async putKycCA(body) {
        try {
            return await this.appService.putKycCA(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvCookieStartCA(body) {
        try {
            return await this.appService.idvCookieStartCA(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async healthCA() {
        try {
            return await this.appService.healthCA();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStartJP(body) {
        try {
            return await this.appService.idvStartJP(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async getKycJP(body) {
        try {
            return await this.appService.getKycJP(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async putKycJP(body) {
        try {
            return await this.appService.putKycJP(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvCookieStartJP(body) {
        try {
            return await this.appService.idvCookieStartJP(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async notificationJP(body) {
        try {
            return await this.appService.notificationJP(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async healthJP() {
        try {
            return await this.appService.healthJP();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvStartCN(body) {
        try {
            return await this.appService.idvStartCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvTokenCN(body) {
        try {
            return await this.appService.idvTokenCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvKycGetCN(body) {
        try {
            return await this.appService.idvKycGetCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvResultWebCN() {
        try {
            return await this.appService.idvResultWebCN();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async healthCN() {
        try {
            return await this.appService.healthCN();
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvMockStartCN(body) {
        try {
            return await this.appService.idvMockStartCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvMockTokenCN(body) {
        try {
            return await this.appService.idvMockTokenCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async idvMockKycGetCN(body) {
        try {
            return await this.appService.idvMockKycGetCN(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async plaidTokenSession(body) {
        try {
            return await this.appService.plaidTokenSession(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async liquidTokenSession(body) {
        try {
            return await this.appService.liquidTokenSession(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
    async loginTicket(body) {
        try {
            return await this.appService.loginTicket(body);
        }
        catch (e) {
            return rethrow(e);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('/v1/oauth2/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "issueClientCredentialsToken", null);
__decorate([
    (0, common_1.Post)('/v1/idv/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStart", null);
__decorate([
    (0, common_1.Post)('/v1/idv/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvKycGet", null);
__decorate([
    (0, common_1.Post)('/v1/idv/us/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartUS", null);
__decorate([
    (0, common_1.Post)('/v1/idv/us/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycUS", null);
__decorate([
    (0, common_1.Post)('/v1/idv/us/kyc/put'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "putKycUS", null);
__decorate([
    (0, common_1.Post)('/v1/idv/us/cookie/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvCookieStartUS", null);
__decorate([
    (0, common_1.Get)('/v1/idv/us/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "healthUS", null);
__decorate([
    (0, common_1.Post)('/v1/idv/uk/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartUK", null);
__decorate([
    (0, common_1.Post)('/v1/idv/uk/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycUK", null);
__decorate([
    (0, common_1.Post)('/v1/idv/uk/kyc/put'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "putKycUK", null);
__decorate([
    (0, common_1.Post)('/v1/idv/uk/cookie/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvCookieStartUK", null);
__decorate([
    (0, common_1.Get)('/v1/idv/uk/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "healthUK", null);
__decorate([
    (0, common_1.Post)('/v1/idv/ca/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartCA", null);
__decorate([
    (0, common_1.Post)('/v1/idv/ca/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycCA", null);
__decorate([
    (0, common_1.Post)('/v1/idv/ca/kyc/put'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "putKycCA", null);
__decorate([
    (0, common_1.Post)('/v1/idv/ca/cookie/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvCookieStartCA", null);
__decorate([
    (0, common_1.Get)('/v1/idv/ca/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "healthCA", null);
__decorate([
    (0, common_1.Post)('/v1/idv/jp/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartJP", null);
__decorate([
    (0, common_1.Post)('/v1/idv/jp/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycJP", null);
__decorate([
    (0, common_1.Post)('/v1/idv/jp/kyc/put'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "putKycJP", null);
__decorate([
    (0, common_1.Post)('/v1/idv/jp/cookie/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvCookieStartJP", null);
__decorate([
    (0, common_1.Post)('/v1/idv/jp/notification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "notificationJP", null);
__decorate([
    (0, common_1.Get)('/v1/idv/jp/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "healthJP", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvTokenCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvKycGetCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/result/web'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvResultWebCN", null);
__decorate([
    (0, common_1.Get)('/v1/idv/cn/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "healthCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/mock/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvMockStartCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/mock/token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvMockTokenCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/cn/mock/kyc/get'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvMockKycGetCN", null);
__decorate([
    (0, common_1.Post)('/v1/idv/plaid/token/session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "plaidTokenSession", null);
__decorate([
    (0, common_1.Post)('/v1/idv/liquid/token/session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "liquidTokenSession", null);
__decorate([
    (0, common_1.Post)('/v1/idv/login-ticket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginTicket", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map