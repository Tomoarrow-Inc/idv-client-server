package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.service.IdvService
import com.tomoarrow.idv.bff.service.TokenService
import com.tomoarrow.idv.client.generated.models.*
import kotlinx.coroutines.runBlocking
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

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

    // ===== Per-country start (delegates to session start with country) =====

    @PostMapping("/v1/idv/{country}/start")
    fun idvCountryStart(
        @PathVariable country: String,
        @RequestBody body: SessionStartReq
    ): SessionStartRes = runBlocking {
        val token = tokenService.requireAccessToken()
        val resolved = Country.decode(country)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown country: $country")
        idvService.idvSessionStart("Bearer $token", body.copy(country = resolved))
    }

    // ===== Per-country kyc/get (delegates to unified kyc/get with country) =====

    @PostMapping("/v1/idv/{country}/kyc/get")
    fun kycCountryGet(
        @PathVariable country: String,
        @RequestBody body: GetKycReq
    ): GetKycRes = runBlocking {
        val token = tokenService.requireAccessToken()
        val resolved = Country.decode(country)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown country: $country")
        idvService.kycGet("Bearer $token", body.copy(country = resolved))
    }

}
