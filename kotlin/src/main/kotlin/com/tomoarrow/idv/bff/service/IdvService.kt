package com.tomoarrow.idv.bff.service

import com.tomoarrow.idv.client.apis.DefaultApi
import com.tomoarrow.idv.client.models.*
import org.springframework.stereotype.Service

/**
 * Wraps all DefaultApi methods as suspend functions.
 * Provides a transparent proxy to idv-server via the generated Kotlin client.
 */
@Service
class IdvService(
    private val api: DefaultApi,
    private val tokenService: TokenService
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

    suspend fun kycUsPut(req: PlaidPutKycReq) {
        api.v1IdvUsKycPutPost(plaidPutKycReq = req)
    }

    suspend fun idvUsCookieStart(req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvUsCookieStartPost(plaidStartIdvRequest = req)
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

    suspend fun kycUkPut(req: PlaidPutKycReq) {
        api.v1IdvUkKycPutPost(plaidPutKycReq = req)
    }

    suspend fun idvUkCookieStart(req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvUkCookieStartPost(plaidStartIdvRequest = req)
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

    suspend fun kycCaPut(req: PlaidPutKycReq) {
        api.v1IdvCaKycPutPost(plaidPutKycReq = req)
    }

    suspend fun idvCaCookieStart(req: PlaidStartIdvRequest): PlaidStartIdvResp {
        return api.v1IdvCaCookieStartPost(plaidStartIdvRequest = req)
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

    suspend fun kycJpPut(req: LiquidPutKycReq) {
        api.v1IdvJpKycPutPost(liquidPutKycReq = req)
    }

    suspend fun idvJpCookieStart(req: LiquidStartIdvRequest): LiquidIntegratedAppResponse {
        return api.v1IdvJpCookieStartPost(liquidStartIdvRequest = req)
    }

    suspend fun idvJpNotification(body: Any?): EitherStringValue {
        return api.v1IdvJpNotificationPost(body = body)
    }

    suspend fun idvJpHealth(): String {
        return api.v1IdvJpHealthGet()
    }

    // ===== CN (Tencent/TomoIdv) =====

    suspend fun idvCnStart(authorization: String, req: TomoIdvStartReq): TomoIdvStartRes {
        return api.v1IdvCnStartPost(authorization = authorization, tomoIdvStartReq = req)
    }

    suspend fun idvCnToken(authorization: String, req: TomoIdvIssueTokenReq): TomoIdvIssueTokenRes {
        return api.v1IdvCnTokenPost(authorization = authorization, tomoIdvIssueTokenReq = req)
    }

    suspend fun kycCnGet(authorization: String, req: TomoIdvGetResultReq): Any {
        return api.v1IdvCnKycGetPost(authorization = authorization, tomoIdvGetResultReq = req)
    }

    suspend fun idvCnResultWeb(): Any {
        return api.v1IdvCnResultWebPost()
    }

    suspend fun idvCnHealth(): String {
        return api.v1IdvCnHealthGet()
    }

    suspend fun idvCnMockStart(authorization: String, req: TomoIdvMockStartReq): TomoIdvMockStartRes {
        return api.v1IdvCnMockStartPost(authorization = authorization, tomoIdvMockStartReq = req)
    }

    suspend fun idvCnMockToken(authorization: String, req: TomoIdvMockIssueTokenReq): TomoIdvMockIssueTokenRes {
        return api.v1IdvCnMockTokenPost(authorization = authorization, tomoIdvMockIssueTokenReq = req)
    }

    suspend fun idvCnMockKycGet(authorization: String, req: TomoIdvMockGetResultReq): Any {
        return api.v1IdvCnMockKycGetPost(authorization = authorization, tomoIdvMockGetResultReq = req)
    }

    // ===== Session Tokens =====

    suspend fun plaidSessionToken(req: PlaidSessionTokenRequest): SessionToken {
        return api.v1IdvPlaidTokenSessionPost(plaidSessionTokenRequest = req)
    }

    suspend fun liquidSessionToken(req: LiquidSessionTokenRequest): SessionToken {
        return api.v1IdvLiquidTokenSessionPost(liquidSessionTokenRequest = req)
    }

    // ===== Login Ticket =====

    suspend fun loginTicket(req: LoginTicketRequest): LoginTicketResponse {
        return api.v1IdvLoginTicketPost(loginTicketRequest = req)
    }

    // ===== Google (Social KYC) =====

    suspend fun googleStart(authorization: String, req: GoogleStartReq): GoogleStartResp {
        return api.v1IdvGoogleStartPost(authorization = authorization, googleStartReq = req)
    }
}
