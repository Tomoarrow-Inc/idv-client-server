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
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async issueClientCredentialsTokenSdk() {
        try {
            return await this.appService.issueClientCredentialsTokenSdk();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStartUS(user_id) {
        try {
            return await this.appService.idvStartUS(user_id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getKycUS(user_id, fields) {
        try {
            const fieldsArray = fields === undefined
                ? undefined
                : Array.isArray(fields)
                    ? fields
                    : typeof fields === 'string' && fields.trim() === ''
                        ? []
                        : fields.split(',').map(f => f.trim()).filter(f => f.length > 0);
            return await this.appService.getKycUS(user_id, fieldsArray);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStartJP(user_id) {
        try {
            return await this.appService.idvStartJP(user_id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getKycJP(user_id, fields) {
        try {
            const fieldsArray = fields === undefined
                ? undefined
                : Array.isArray(fields)
                    ? fields
                    : typeof fields === 'string' && fields.trim() === ''
                        ? []
                        : fields.split(',').map(f => f.trim()).filter(f => f.length > 0);
            return await this.appService.getKycJP(user_id, fieldsArray);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStart(user_id, callback_url, email, country) {
        try {
            return await this.appService.idvStart(user_id, callback_url, email, country);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('access_token_sdk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "issueClientCredentialsTokenSdk", null);
__decorate([
    (0, common_1.Get)('us/start'),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartUS", null);
__decorate([
    (0, common_1.Get)('us/kyc/get'),
    __param(0, (0, common_1.Query)('user_id')),
    __param(1, (0, common_1.Query)('fields')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycUS", null);
__decorate([
    (0, common_1.Get)('jp/start'),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartJP", null);
__decorate([
    (0, common_1.Get)('jp/kyc/get'),
    __param(0, (0, common_1.Query)('user_id')),
    __param(1, (0, common_1.Query)('fields')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycJP", null);
__decorate([
    (0, common_1.Get)('start'),
    __param(0, (0, common_1.Query)('user_id')),
    __param(1, (0, common_1.Query)('callback_url')),
    __param(2, (0, common_1.Query)('email')),
    __param(3, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStart", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map