package com.tomoarrow.idv.bff

import com.tomoarrow.idv.client.generated.models.StartIdvReq
import com.tomoarrow.idv.bff.controller.IdvController
import kotlinx.serialization.ExperimentalSerializationApi
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

@OptIn(ExperimentalSerializationApi::class)
class StartIdvReqContractTest {
    @Test
    fun `StartIdvReq includes public kyc_policy request field`() {
        // Verifies the BFF is built against the local Kotlin SDK generated from the current contract.
        // A stale Maven Central SDK drops kyc_policy and makes /v1/idv/start reject test-board requests.
        val descriptor = StartIdvReq.serializer().descriptor
        val fieldNames = (0 until descriptor.elementsCount)
            .map { descriptor.getElementName(it) }
            .toSet()

        assertTrue(
            fieldNames.contains("kyc_policy"),
            "StartIdvReq must expose kyc_policy for /v1/idv/start",
        )
    }

    @Test
    fun `Kotlin BFF start endpoint receives raw JSON map`() {
        // Verifies /v1/idv/start stays a transparent proxy.
        // Generated KycPolicy contains Any fields, so a typed SDK request would fail before reaching idv-server.
        val startMethod = IdvController::class.java.methods.single {
            it.name == "idvStart" && it.parameterTypes.size == 1
        }

        assertEquals(Map::class.java, startMethod.parameterTypes[0])
    }
}
