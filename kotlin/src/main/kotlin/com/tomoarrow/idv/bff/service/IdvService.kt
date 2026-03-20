package com.tomoarrow.idv.bff.service

import com.fasterxml.jackson.databind.ObjectMapper
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
    private val tokenService: TokenService,
    private val appProperties: AppProperties
) {
    private val httpClient = OkHttpClient()
    private val objectMapper = ObjectMapper()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    // ===== Generic (country-agnostic) =====

    suspend fun idvStart(authorization: String, startIdvReq: StartIdvReq): StartIdvResp {
        return api.v1IdvStartPost(authorization = authorization, startIdvReq = startIdvReq)
    }

    suspend fun kycGet(authorization: String, getKycReq: GetKycReq): GetKycResp {
        return api.v1IdvKycGetPost(authorization = authorization, getKycReq = getKycReq)
    }

    // ===== US (Plaid) =====

    suspend fun idvUsStart(authorization: String, req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvUsStartPost(authorization = authorization, plaidStartIdvRequest = req)
    }

    suspend fun kycUsGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvUsKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvUsHealth(): String {
        return api.v1IdvUsHealthGet()
    }

    // ===== UK (Plaid) =====

    suspend fun idvUkStart(authorization: String, req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvUkStartPost(authorization = authorization, plaidStartIdvRequest = req)
    }

    suspend fun kycUkGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvUkKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvUkHealth(): String {
        return api.v1IdvUkHealthGet()
    }

    // ===== CA (Plaid) =====

    suspend fun idvCaStart(authorization: String, req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvCaStartPost(authorization = authorization, plaidStartIdvRequest = req)
    }

    suspend fun kycCaGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvCaKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvCaHealth(): String {
        return api.v1IdvCaHealthGet()
    }

    // ===== JP (Liquid) =====

    suspend fun idvJpStart(authorization: String, req: LiquidStartIdvRequest): LiquidIntegratedAppResponse {
        return api.v1IdvJpStartPost(authorization = authorization, liquidStartIdvRequest = req)
    }

    suspend fun kycJpGet(authorization: String, req: LiquidGetKycReq): Map<String, String> {
        return api.v1IdvJpKycGetPost(authorization = authorization, liquidGetKycReq = req)
    }

    suspend fun idvJpHealth(): String {
        return api.v1IdvJpHealthGet()
    }

    // ===== CN (Tencent/TomoIdv) =====

    suspend fun idvCnStart(authorization: String, req: TomoIdvStartReq): TomoIdvStartRes {
        return api.v1IdvCnStartPost(authorization = authorization, tomoIdvStartReq = req)
    }

    suspend fun kycCnGet(authorization: String, req: TencentGetKycReq): TencentGetUnionResultResp {
        return api.v1IdvCnKycGetPost(authorization = authorization, tencentGetKycReq = req)
    }

    suspend fun idvCnHealth(): String {
        return api.v1IdvCnHealthGet()
    }

    // CN Mock — raw HTTP (SDK no longer provides these methods)

    suspend fun idvCnMockStart(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/start", body, authorization)
    }

    suspend fun idvCnMockToken(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/token", body, authorization)
    }

    suspend fun idvCnMockKycGet(authorization: String, body: Map<String, Any>): Any {
        return rawPost("/v1/idv/cn/mock/kyc/get", body, authorization)
    }

    // ===== Social KYC =====

    suspend fun googleStart(authorization: String, req: GoogleStartReq): GoogleStartResp {
        return api.v1IdvSocialGoogleStartPost(authorization = authorization, googleStartReq = req)
    }

    suspend fun wechatStart(authorization: String, req: WeChatStartReq): WeChatStartResp {
        return api.v1IdvSocialWechatStartPost(authorization = authorization, weChatStartReq = req)
    }

    suspend fun socialResult(authorization: String, req: SocialResultReq): GetKycResp {
        return api.v1IdvSocialResultPost(authorization = authorization, socialResultReq = req)
    }

    // ===== Raw HTTP helper =====

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
