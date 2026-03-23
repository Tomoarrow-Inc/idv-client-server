package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.service.TokenService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class OAuthController(
    private val tokenService: TokenService
) {

    @PostMapping("/v1/oauth2/token")
    fun issueToken(): TokenService.IssueAccessTokenResult = runBlocking {
        tokenService.issueClientCredentialsToken()
    }
}
