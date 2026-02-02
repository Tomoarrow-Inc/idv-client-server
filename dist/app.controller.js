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
const api_1 = require("./contract/api");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async issueClientCredentialsToken() {
        try {
            return await this.appService.issueClientCredentialsToken();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStartUS(body) {
        try {
            return await this.appService.idvStartUS(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getKycUS(body) {
        try {
            return await this.appService.getKycUS(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStartJP(body) {
        try {
            return await this.appService.idvStartJP(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getKycJP(body) {
        try {
            return await this.appService.getKycJP(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async idvStart(body) {
        try {
            return await this.appService.idvStart(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)(api_1.contract.access_token.path),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "issueClientCredentialsToken", null);
__decorate([
    (0, common_1.Post)(api_1.contract.idv_us_start.path),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartUS", null);
__decorate([
    (0, common_1.Post)(api_1.contract.idv_us_get_result.path),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycUS", null);
__decorate([
    (0, common_1.Post)(api_1.contract.idv_jp_start.path),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStartJP", null);
__decorate([
    (0, common_1.Post)(api_1.contract.idv_jp_get_result.path),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getKycJP", null);
__decorate([
    (0, common_1.Post)(api_1.contract.idv_start.path),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "idvStart", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map