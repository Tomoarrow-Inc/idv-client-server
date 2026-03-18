package com.tomoarrow.idv.bff.service

import com.tomoarrow.idv.bff.auth.JwtAssertionBuilder
import com.tomoarrow.idv.bff.config.AppProperties
import com.tomoarrow.idv.client.apis.DefaultApi
import org.springframework.stereotype.Service

/**
 * Handles OAuth2 client_credentials token issuance via JWT assertion.
 * Calls DefaultApi.v1Oauth2TokenPost() with the JWT assertion,
 * then stores the resulting access token in StateService.
 */
@Service
class TokenService(
    private val appProperties: AppProperties,
    private val stateService: StateService,
    private val api: DefaultApi
) {

    data class IssueAccessTokenResult(
        val clientId: String,
        val accessToken: String,
        val tokenType: String,
        val expiresIn: Long,
        val scope: String?
    )

    suspend fun issueClientCredentialsToken(): IssueAccessTokenResult {
        val baseUrl = appProperties.idvBaseUrl.trimEnd('/')
        val clientId = appProperties.tomoIdvClientId

        val clientAssertion = JwtAssertionBuilder.createClientAssertion(
            clientId = clientId,
            secretKey = appProperties.tomoIdvSecret,
            baseUrl = baseUrl
        )

        val tokenResponse = api.v1Oauth2TokenPost(
            clientAssertion = clientAssertion,
            clientAssertionType = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            grantType = "client_credentials",
            resource = "https://api.tomopayment.com/v1/idv",
            scope = "idv.read"
        )

        val accessToken = tokenResponse.accessToken ?: ""
        val tokenType = tokenResponse.tokenType ?: "Bearer"
        val expiresIn = tokenResponse.expiresIn ?: 0L

        stateService.set("access_token", accessToken)
        stateService.set("token_info", mapOf(
            "client_id" to clientId,
            "token_type" to tokenType,
            "expires_in" to expiresIn,
            "scope" to (tokenResponse.scope ?: ""),
            "issued_at" to java.time.Instant.now().toString()
        ))

        return IssueAccessTokenResult(
            clientId = clientId,
            accessToken = accessToken,
            tokenType = tokenType,
            expiresIn = expiresIn,
            scope = tokenResponse.scope
        )
    }

    fun requireAccessToken(): String {
        return stateService.get("access_token") as? String
            ?: throw IllegalStateException("No access token found. Please call /v1/oauth2/token first.")
    }
}
