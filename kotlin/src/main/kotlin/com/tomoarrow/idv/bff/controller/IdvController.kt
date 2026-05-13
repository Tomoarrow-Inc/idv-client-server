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
    fun idvStart(@RequestBody body: Map<String, Any?>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvStart("Bearer $token", body)
    }

    // 문제점: generated StartIdvReq는 KycPolicy 내부 Any 필드를 재직렬화하지 못해 kyc_policy 요청을 502로 만든다.
    // 개선 함수명: idvStart
    fun idvStartOld(@RequestBody body: StartIdvReq): StartIdvRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.idvStartOld("Bearer $token", body)
    }

    @PostMapping("/v1/idv/kyc/get")
    fun kycGet(@RequestBody body: GetKycReq): GetKycRes = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.kycGet("Bearer $token", body)
    }

    // ===== Session (vendor-agnostic) =====

    @PostMapping("/v1/idv/sessions/start")
    fun idvSessionStart(@RequestBody body: Map<String, Any?>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.proxyPost("Bearer $token", "/v1/idv/sessions/start", body)
    }

    // ===== Per-country start (transparent proxy) =====

    @PostMapping("/v1/idv/{country}/start")
    fun idvCountryStart(
        @PathVariable country: String,
        @RequestBody body: Map<String, Any?>
    ): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.proxyPost("Bearer $token", "/v1/idv/$country/start", body)
    }

    // ===== Per-country kyc/get (transparent proxy) =====

    @PostMapping("/v1/idv/{country}/kyc/get")
    fun kycCountryGet(
        @PathVariable country: String,
        @RequestBody body: Map<String, Any?>
    ): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        idvService.proxyPost("Bearer $token", "/v1/idv/$country/kyc/get", body)
    }

}
