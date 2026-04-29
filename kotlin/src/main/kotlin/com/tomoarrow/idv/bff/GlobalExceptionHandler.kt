package com.tomoarrow.idv.bff

import com.tomoarrow.idv.client.generated.infrastructure.ClientException
import com.tomoarrow.idv.client.generated.infrastructure.ClientError
import com.tomoarrow.idv.client.generated.infrastructure.Response
import com.tomoarrow.idv.client.generated.infrastructure.ServerException
import com.tomoarrow.idv.client.generated.infrastructure.ServerError
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
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
    fun handleClientException(ex: ClientException): ResponseEntity<Any?> {
        val status = ex.statusCode
        return ResponseEntity.status(status).body(upstreamBody(ex.response, ex.message))
    }

    @ExceptionHandler(ServerException::class)
    fun handleServerException(ex: ServerException): ResponseEntity<Any?> {
        val status = ex.statusCode
        return ResponseEntity.status(status).body(upstreamBody(ex.response, ex.message))
    }

    @ExceptionHandler(UpstreamHttpException::class)
    fun handleUpstreamHttpException(ex: UpstreamHttpException): ResponseEntity<String> {
        val headers = HttpHeaders()
        ex.contentType?.let { headers.contentType = MediaType.parseMediaType(it) }
        return ResponseEntity.status(ex.statusCode).headers(headers).body(ex.body)
    }

    @ExceptionHandler(IllegalStateException::class)
    fun handleIllegalState(ex: IllegalStateException): ResponseEntity<Map<String, Any?>> {
        return ResponseEntity.badRequest().body(
            mapOf(
                "statusCode" to 400,
                "message" to ex.message
            )
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<Map<String, Any?>> {
        return ResponseEntity.status(502).body(
            mapOf(
                "statusCode" to 502,
                "message" to (ex.message ?: "Unknown error")
            )
        )
    }

    companion object {
        fun upstreamBody(response: Response?, fallback: String?): Any? =
            when (response) {
                is ClientError<*> -> response.body ?: response.message ?: fallback
                is ServerError<*> -> response.body ?: response.message ?: fallback
                else -> fallback
            }
    }
}

class UpstreamHttpException(
    val statusCode: Int,
    val body: String,
    val contentType: String?
) : RuntimeException("Upstream HTTP $statusCode")
