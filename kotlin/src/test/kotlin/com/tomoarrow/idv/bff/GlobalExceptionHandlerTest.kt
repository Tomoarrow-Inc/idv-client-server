package com.tomoarrow.idv.bff

import com.tomoarrow.idv.client.generated.infrastructure.ClientError
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GlobalExceptionHandlerTest {

    @Test
    fun `preserves upstream client error body without message rewriting`() {
        // This reproduces an idv-server validation error captured by the
        // generated SDK. The BFF must forward body as-is.
        val upstream = ClientError<Any>(
            message = "Bad Request",
            body = "validation failed"
        )
        val body = GlobalExceptionHandler.upstreamBody(upstream, "fallback")

        assertEquals("validation failed", body)
    }
}
