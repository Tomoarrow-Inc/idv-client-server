package com.tomoarrow.idv.bff.service

import com.tomoarrow.idv.client.generated.apis.DefaultApi
import com.tomoarrow.idv.client.generated.models.*
import org.springframework.stereotype.Service

/**
 * Wraps all DefaultApi methods as suspend functions.
 * Provides a transparent proxy to idv-server via the generated Kotlin client.
 */
@Service
class IdvService(
    private val api: DefaultApi
) {

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

}
