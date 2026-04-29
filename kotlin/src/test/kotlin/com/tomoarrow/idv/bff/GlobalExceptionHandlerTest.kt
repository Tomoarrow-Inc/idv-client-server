package com.tomoarrow.idv.bff

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class GlobalExceptionHandlerTest {

    @Test
    fun `normalizes legacy Korean empty kyc policy message to English`() {
        // This reproduces the BFF {statusCode, message} policy validation error
        // shape and prevents Korean text from leaking to API clients.
        val normalized = GlobalExceptionHandler.normalizeErrorMessage(
            "kyc_policy_id \uAC12\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694."
        )

        assertEquals(GlobalExceptionHandler.EMPTY_KYC_POLICY_ID_MESSAGE, normalized)
    }

    @Test
    fun `removes legacy Korean empty kyc policy text from sdk prefixed messages`() {
        // Generated SDK exceptions may prefix the upstream validation message;
        // the BFF response must still be English-only.
        val normalized = GlobalExceptionHandler.normalizeErrorMessage(
            "Client error : 400 kyc_policy_id \uAC12\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694."
        )

        assertEquals(
            "Client error : 400 ${GlobalExceptionHandler.EMPTY_KYC_POLICY_ID_MESSAGE}",
            normalized
        )
    }
}
