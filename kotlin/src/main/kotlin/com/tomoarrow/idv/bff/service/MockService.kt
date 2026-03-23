package com.tomoarrow.idv.bff.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.tomoarrow.idv.bff.config.AppProperties
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.stereotype.Service

/**
 * Handles CN mock endpoints via raw HTTP.
 * These mock endpoints are not covered by the generated SDK,
 * so we use OkHttpClient to forward requests to idv-server.
 */
@Service
class MockService(
    private val tokenService: TokenService,
    private val appProperties: AppProperties
) {
    private val httpClient = OkHttpClient()
    private val objectMapper = ObjectMapper()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun idvCnMockStart(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/start", body, authorization)
    }

    suspend fun idvCnMockToken(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/token", body, authorization)
    }

    suspend fun idvCnMockKycGet(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/kyc/get", body, authorization)
    }

    private fun rawPost(path: String, body: Any, authorization: String): Any {
        val url = "${appProperties.idvBaseUrl.trimEnd('/')}$path"
        val jsonBody = objectMapper.writeValueAsString(body).toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url(url)
            .post(jsonBody)
            .addHeader("Authorization", authorization)
            .addHeader("Content-Type", "application/json")
            .build()

        httpClient.newCall(request).execute().use { response ->
            val responseBody = response.body?.string() ?: ""
            if (!response.isSuccessful) {
                throw RuntimeException("Upstream error ${response.code}: $responseBody")
            }
            return try {
                objectMapper.readValue(responseBody, Map::class.java)
            } catch (_: Exception) {
                responseBody
            }
        }
    }
}
