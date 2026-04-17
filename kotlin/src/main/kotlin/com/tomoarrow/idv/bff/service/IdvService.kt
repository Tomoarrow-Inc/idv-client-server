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

    // ===== Session (vendor-agnostic) =====

    suspend fun idvSessionStart(authorization: String, sessionStartReq: SessionStartReq): SessionStartRes {
        return api.v1IdvSessionsStartPost(authorization = authorization, sessionStartReq = sessionStartReq)
    }

}
