package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.service.MockService
import com.tomoarrow.idv.bff.service.TokenService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.*

@RestController
class MockController(
    private val mockService: MockService,
    private val tokenService: TokenService
) {

    @PostMapping("/v1/idv/cn/mock/start")
    fun idvCnMockStart(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        mockService.idvCnMockStart("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/token")
    fun idvCnMockToken(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        mockService.idvCnMockToken("Bearer $token", body)
    }

    @PostMapping("/v1/idv/cn/mock/kyc/get")
    fun idvCnMockKycGet(@RequestBody body: Map<String, Any>): Any = runBlocking {
        val token = tokenService.requireAccessToken()
        mockService.idvCnMockKycGet("Bearer $token", body)
    }
}
