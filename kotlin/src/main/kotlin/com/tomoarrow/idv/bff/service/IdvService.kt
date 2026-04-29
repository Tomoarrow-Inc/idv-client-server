package com.tomoarrow.idv.bff.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.tomoarrow.idv.bff.UpstreamHttpException
import com.tomoarrow.idv.bff.config.AppProperties
import com.tomoarrow.idv.client.generated.apis.DefaultApi
import com.tomoarrow.idv.client.generated.models.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.stereotype.Service

/**
 * Wraps all DefaultApi methods as suspend functions.
 * Provides a transparent proxy to idv-server via the generated Kotlin client.
 */
@Service
class IdvService(
    private val api: DefaultApi,
    private val appProperties: AppProperties,
    private val objectMapper: ObjectMapper
) {
    private val httpClient = OkHttpClient()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    // ===== Generic (country-agnostic) =====

    suspend fun idvStart(authorization: String, startIdvReq: StartIdvReq): StartIdvRes {
        return api.v1IdvStartPost(authorization = authorization, startIdvReq = startIdvReq)
    }

    suspend fun kycGet(authorization: String, getKycReq: GetKycReq): GetKycRes {
        return api.v1IdvKycGetPost(authorization = authorization, getKycReq = getKycReq)
    }

    suspend fun proxyPost(authorization: String, path: String, body: Any): Any {
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
                throw UpstreamHttpException(response.code, responseBody, response.header("Content-Type"))
            }
            return try {
                objectMapper.readValue(responseBody, Map::class.java)
            } catch (_: Exception) {
                responseBody
            }
        }
    }
}
