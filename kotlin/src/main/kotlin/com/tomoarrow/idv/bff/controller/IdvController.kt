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
    fun idvStart(@RequestBody body: StartIdvReq): StartIdvRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/kyc/get")
    fun kycGet(@RequestBody body: GetKycReq): GetKycRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycGet("Bearer $token", body)
    }

    // ===== Session (vendor-agnostic) =====

    @PostMapping("/v1/idv/sessions/start")
    fun idvSessionStart(@RequestBody body: SessionStartReq): SessionStartRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvSessionStart("Bearer $token", body)
    }

    // ===== US (Plaid) =====

    @PostMapping("/v1/idv/us/start")
    fun idvUsStart(@RequestBody body: PlaidStartIdvReq): PlaidStartIdvRes = runBlocking {
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
    fun idvUkStart(@RequestBody body: PlaidStartIdvReq): PlaidStartIdvRes = runBlocking {
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
    fun idvCaStart(@RequestBody body: PlaidStartIdvReq): PlaidStartIdvRes = runBlocking {
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
    fun idvJpStart(@RequestBody body: LiquidStartIdvReq): LiquidIntegratedAppRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvJpStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/jp/kyc/get")
    fun kycJpGet(@RequestBody body: LiquidGetKycReq): LiquidGetUnionResultRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycJpGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/jp/health")
    fun idvJpHealth(): String = runBlocking {
        idvService.idvJpHealth()
    }

    // ===== CN (Tencent/TomoIdv) =====

    @PostMapping("/v1/idv/cn/start")
    fun idvCnStart(@RequestBody body: TencentStartReq): TencentStartIdvRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/kyc/get")
    fun kycCnGet(@RequestBody body: TencentGetKycReq): TencentGetUnionResultRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycCnGet("Bearer $token", body)
    }

    @GetMapping("/v1/idv/cn/health")
    fun idvCnHealth(): String = runBlocking {
        idvService.idvCnHealth()
    }

}
