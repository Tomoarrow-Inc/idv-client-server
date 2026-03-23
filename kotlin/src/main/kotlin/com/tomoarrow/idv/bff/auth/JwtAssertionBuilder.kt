package com.tomoarrow.idv.bff.auth

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.ECDSASigner
import com.nimbusds.jose.jwk.ECKey
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import java.util.Base64
import java.util.Date
import java.util.UUID

/**
 * ES256 JWT client assertion builder using nimbus-jose-jwt.
 * Parses TOMO_IDV_SECRET (base64url-encoded JWK) into an ECKey,
 * then signs a JWT with iss/sub=clientId, aud=baseUrl+/v1/oauth2/token, exp=now+300s.
 */
object JwtAssertionBuilder {

    fun createClientAssertion(clientId: String, secretKey: String, baseUrl: String): String {
        val ecKey = parseSecretKey(secretKey)
        val signer = ECDSASigner(ecKey)

        val now = Date()
        val exp = Date(now.time + 300_000) // 300 seconds

        val claims = JWTClaimsSet.Builder()
            .issuer(clientId)
            .subject(clientId)
            .audience("${baseUrl.trimEnd('/')}/v1/oauth2/token")
            .issueTime(now)
            .expirationTime(exp)
            .jwtID(UUID.randomUUID().toString())
            .build()

        val header = JWSHeader.Builder(JWSAlgorithm.ES256)
            .type(com.nimbusds.jose.JOSEObjectType.JWT)
            .build()

        val signedJwt = SignedJWT(header, claims)
        signedJwt.sign(signer)
        return signedJwt.serialize()
    }

    private fun parseSecretKey(base64urlEncodedJwk: String): ECKey {
        val decoded = base64UrlDecode(base64urlEncodedJwk)
        val jsonString = String(decoded, Charsets.UTF_8)
        return ECKey.parse(jsonString)
    }

    private fun base64UrlDecode(input: String): ByteArray {
        return Base64.getUrlDecoder().decode(input)
    }
}
