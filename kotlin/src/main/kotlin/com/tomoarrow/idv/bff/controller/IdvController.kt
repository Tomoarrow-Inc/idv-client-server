package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.service.IdvService
import com.tomoarrow.idv.bff.service.TokenService
import com.tomoarrow.idv.client.models.*
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

    @PostMapping("/v1/idv/us/kyc/put")
    fun kycUsPut(@RequestBody body: PlaidPutKycReq) = runBlocking {
        idvService.kycUsPut(body)
    }

    @PostMapping("/v1/idv/us/cookie/start")
    fun idvUsCookieStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        idvService.idvUsCookieStart(body)
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

    @PostMapping("/v1/idv/uk/kyc/put")
    fun kycUkPut(@RequestBody body: PlaidPutKycReq) = runBlocking {
        idvService.kycUkPut(body)
    }

    @PostMapping("/v1/idv/uk/cookie/start")
    fun idvUkCookieStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        idvService.idvUkCookieStart(body)
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

    @PostMapping("/v1/idv/ca/kyc/put")
    fun kycCaPut(@RequestBody body: PlaidPutKycReq) = runBlocking {
        idvService.kycCaPut(body)
    }

    @PostMapping("/v1/idv/ca/cookie/start")
    fun idvCaCookieStart(@RequestBody body: PlaidStartIdvRequest): PlaidStartIdvResp = runBlocking {
        idvService.idvCaCookieStart(body)
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

    @PostMapping("/v1/idv/jp/kyc/put")
    fun kycJpPut(@RequestBody body: LiquidPutKycReq) = runBlocking {
        idvService.kycJpPut(body)
    }

    @PostMapping("/v1/idv/jp/cookie/start")
    fun idvJpCookieStart(@RequestBody body: LiquidStartIdvRequest): LiquidIntegratedAppResponse = runBlocking {
        idvService.idvJpCookieStart(body)
    }

    @PostMapping("/v1/idv/jp/notification")
    fun idvJpNotification(@RequestBody body: Any?): EitherStringValue = runBlocking {
        idvService.idvJpNotification(body)
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

    @PostMapping("/v1/idv/cn/token")
    fun idvCnToken(@RequestBody body: TomoIdvIssueTokenReq): TomoIdvIssueTokenRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnToken("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/kyc/get")
    fun kycCnGet(@RequestBody body: TomoIdvGetResultReq): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycCnGet("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/result/web")
    fun idvCnResultWeb(): Any = runBlocking {
        idvService.idvCnResultWeb()
    }

    @GetMapping("/v1/idv/cn/health")
    fun idvCnHealth(): String = runBlocking {
        idvService.idvCnHealth()
    }

    @PostMapping("/v1/idv/cn/mock/start")
    fun idvCnMockStart(@RequestBody body: TomoIdvMockStartReq): TomoIdvMockStartRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/token")
    fun idvCnMockToken(@RequestBody body: TomoIdvMockIssueTokenReq): TomoIdvMockIssueTokenRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockToken("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/kyc/get")
    fun idvCnMockKycGet(@RequestBody body: TomoIdvMockGetResultReq): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvCnMockKycGet("Bearer $token", body)
    }

    // ===== Session Tokens =====

    @PostMapping("/v1/idv/plaid/token/session")
    fun plaidSessionToken(@RequestBody body: PlaidSessionTokenRequest): SessionToken = runBlocking {
        idvService.plaidSessionToken(body)
    }

    @PostMapping("/v1/idv/liquid/token/session")
    fun liquidSessionToken(@RequestBody body: LiquidSessionTokenRequest): SessionToken = runBlocking {
        idvService.liquidSessionToken(body)
    }

    // ===== Login Ticket =====

    @PostMapping("/v1/idv/login-ticket")
    fun loginTicket(@RequestBody body: LoginTicketRequest): LoginTicketResponse = runBlocking {
        idvService.loginTicket(body)
    }

    // ===== Google (Social KYC) =====

    @PostMapping("/v1/idv/google/start")
    fun googleStart(@RequestBody body: GoogleStartReq): GoogleStartResp = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.googleStart("Bearer $token", body)
    }
}
