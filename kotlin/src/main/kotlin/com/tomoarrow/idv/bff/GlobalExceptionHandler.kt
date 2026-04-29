package com.tomoarrow.idv.bff

import com.tomoarrow.idv.client.generated.infrastructure.ClientException
import com.tomoarrow.idv.client.generated.infrastructure.ServerException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/**
 * Global exception handler that forwards SDK exceptions (ClientException, ServerException)
 * to the caller, preserving the upstream HTTP status code and error body.
 */
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ClientException::class)
    fun handleClientException(ex: ClientException): ResponseEntity<Map<String, Any?>> {
        val status = ex.statusCode
        return ResponseEntity.status(status).body(
            mapOf(
                "statusCode" to status,
                "message" to normalizeErrorMessage(ex.message)
            )
        )
    }

    @ExceptionHandler(ServerException::class)
    fun handleServerException(ex: ServerException): ResponseEntity<Map<String, Any?>> {
        val status = ex.statusCode
        return ResponseEntity.status(status).body(
            mapOf(
                "statusCode" to status,
                "message" to normalizeErrorMessage(ex.message)
            )
        )
    }

    @ExceptionHandler(IllegalStateException::class)
    fun handleIllegalState(ex: IllegalStateException): ResponseEntity<Map<String, Any?>> {
        return ResponseEntity.badRequest().body(
            mapOf(
                "statusCode" to 400,
                "message" to normalizeErrorMessage(ex.message)
            )
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<Map<String, Any?>> {
        return ResponseEntity.status(502).body(
            mapOf(
                "statusCode" to 502,
                "message" to normalizeErrorMessage(ex.message ?: "Unknown error")
            )
        )
    }

    companion object {
        const val EMPTY_KYC_POLICY_ID_MESSAGE = "Please provide kyc_policy_id."
        private const val LEGACY_EMPTY_KYC_POLICY_ID_MESSAGE = "kyc_policy_id \uAC12\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694."

        fun normalizeErrorMessage(message: String?): String? =
            message?.replace(LEGACY_EMPTY_KYC_POLICY_ID_MESSAGE, EMPTY_KYC_POLICY_ID_MESSAGE)
    }
}
