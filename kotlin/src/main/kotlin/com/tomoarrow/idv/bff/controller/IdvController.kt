package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.service.IdvService
import com.tomoarrow.idv.bff.service.TokenService
import com.tomoarrow.idv.client.generated.models.*
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
class IdvController(
    private val idvService: IdvService,
    private val tokenService: TokenService
) {

    // ===== Generic (country-agnostic) =====

    @PostMapping("/v1/idv/start")
    fun idvStart(@RequestBody body: StartIdvReq): StartIdvResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/kyc/get")
    fun kycGet(@RequestBody body: GetKycReq): GetKycResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycGet("Bearer $token", body)
    }

    // ===== US (Plaid) =====

    @PostMapping("/v1/idv/us/start")
    fun idvUsStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvUsStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/us/kyc/get")
    fun kycUsGet(@RequestBody body: PlaidGetKycReq): Map<String, String> = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycUsGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/us/health")
    fun idvUsHealth(): String = runBlocking {
        idvService.idvUsHealth()
    }

    // ===== UK (Plaid) =====

    @PostMapping("/v1/idv/uk/start")
    fun idvUkStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvUkStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/uk/kyc/get")
    fun kycUkGet(@RequestBody body: PlaidGetKycReq): Map<String, String> = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycUkGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/uk/health")
    fun idvUkHealth(): String = runBlocking {
        idvService.idvUkHealth()
    }

    // ===== CA (Plaid) =====

    @PostMapping("/v1/idv/ca/start")
    fun idvCaStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCaStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/ca/kyc/get")
    fun kycCaGet(@RequestBody body: PlaidGetKycReq): Map<String, String> = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycCaGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/ca/health")
    fun idvCaHealth(): String = runBlocking {
        idvService.idvCaHealth()
    }

    // ===== JP (Liquid) =====

    @PostMapping("/v1/idv/jp/start")
    fun idvJpStart(@RequestBody body: LiquidStartIdvRequest): LiquidIntegratedAppResponse = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvJpStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/jp/kyc/get")
    fun kycJpGet(@RequestBody body: LiquidGetKycReq): Map<String, String> = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycJpGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/jp/health")
    fun idvJpHealth(): String = runBlocking {
        idvService.idvJpHealth()
    }

    // ===== CN (Tencent/TomoIdv) =====

    @PostMapping("/v1/idv/cn/start")
    fun idvCnStart(@RequestBody body: TomoIdvStartReq): TomoIdvStartRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/kyc/get")
    fun kycCnGet(@RequestBody body: TencentGetKycReq): TencentGetUnionResultResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycCnGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/cn/health")
    fun idvCnHealth(): String = runBlocking {
        idvService.idvCnHealth()
    }

    @PostMapping("/v1/idv/cn/mock/start")
    fun idvCnMockStart(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/token")
    fun idvCnMockToken(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockToken("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/kyc/get")
    fun idvCnMockKycGet(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockKycGet("Bearer $token", body)
    }

    // ===== Social KYC =====

    @PostMapping("/v1/idv/social/google/start")
    fun googleStart(@RequestBody body: GoogleStartReq): GoogleStartResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.googleStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/social/wechat/start")
    fun wechatStart(@RequestBody body: WeChatStartReq): WeChatStartResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.wechatStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/social/result")
    fun socialResult(@RequestBody body: SocialResultReq): GetKycResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.socialResult("Bearer $token", body)
    }
}
