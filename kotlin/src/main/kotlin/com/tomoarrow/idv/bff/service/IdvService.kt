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

    suspend fun idvStart(authorization: String, startIdvReq: StartIdvReq): StartIdvRes {
        return api.v1IdvStartPost(authorization = authorization, startIdvReq = startIdvReq)
    }

    suspend fun kycGet(authorization: String, getKycReq: GetKycReq): GetKycRes {
        return api.v1IdvKycGetPost(authorization = authorization, getKycReq = getKycReq)
    }

    // ===== US (Plaid) =====

    suspend fun idvUsStart(authorization: String, req: PlaidStartIdvReq): PlaidStartIdvRes {
        return api.v1IdvUsStartPost(authorization = authorization, plaidStartIdvReq = req)
    }

    suspend fun kycUsGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvUsKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvUsHealth(): String {
        return api.v1IdvUsHealthGet()
    }

    // ===== UK (Plaid) =====

    suspend fun idvUkStart(authorization: String, req: PlaidStartIdvReq): PlaidStartIdvRes {
        return api.v1IdvUkStartPost(authorization = authorization, plaidStartIdvReq = req)
    }

    suspend fun kycUkGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvUkKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvUkHealth(): String {
        return api.v1IdvUkHealthGet()
    }

    // ===== CA (Plaid) =====

    suspend fun idvCaStart(authorization: String, req: PlaidStartIdvReq): PlaidStartIdvRes {
        return api.v1IdvCaStartPost(authorization = authorization, plaidStartIdvReq = req)
    }

    suspend fun kycCaGet(authorization: String, req: PlaidGetKycReq): Map<String, String> {
        return api.v1IdvCaKycGetPost(authorization = authorization, plaidGetKycReq = req)
    }

    suspend fun idvCaHealth(): String {
        return api.v1IdvCaHealthGet()
    }

    // ===== JP (Liquid) =====

    suspend fun idvJpStart(authorization: String, req: LiquidStartIdvReq): LiquidIntegratedAppRes {
        return api.v1IdvJpStartPost(authorization = authorization, liquidStartIdvReq = req)
    }

    suspend fun kycJpGet(authorization: String, req: LiquidGetKycReq): LiquidGetUnionResultRes {
        return api.v1IdvJpKycGetPost(authorization = authorization, liquidGetKycReq = req)
    }

    suspend fun idvJpHealth(): String {
        return api.v1IdvJpHealthGet()
    }

    // ===== CN (Tencent/TomoIdv) =====

    suspend fun idvCnStart(authorization: String, req: TencentStartReq): TencentStartIdvRes {
        return api.v1IdvCnStartPost(authorization = authorization, tencentStartReq = req)
    }

    suspend fun kycCnGet(authorization: String, req: TencentGetKycReq): TencentGetUnionResultRes {
        return api.v1IdvCnKycGetPost(authorization = authorization, tencentGetKycReq = req)
    }

    suspend fun idvCnHealth(): String {
        return api.v1IdvCnHealthGet()
    }


}
