package com.tomoarrow.idv.bff.java.service;

import com.tomoarrow.idv.bff.java.config.AppProperties;
import com.tomoarrow.idv.client.BodyOptions;
import com.tomoarrow.idv.client.ClientAssertionHelper;
import com.tomoarrow.idv.client.ClientAssertionOptions;
import com.tomoarrow.idv.client.generated.ApiException;
import com.tomoarrow.idv.client.generated.api.DefaultApi;
import com.tomoarrow.idv.client.generated.model.TokenRes;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final DefaultApi api;
    private final StateService stateService;
    private final AppProperties properties;

    public TokenService(DefaultApi api, StateService stateService, AppProperties properties) {
        this.api = api;
        this.stateService = stateService;
        this.properties = properties;
    }

    public TokenRes issueClientCredentialsToken() throws ApiException {
        if (isBlank(properties.getClientId()) || isBlank(properties.getSecret())) {
            throw new IllegalStateException("TOMO_IDV_CLIENT_ID and TOMO_IDV_SECRET must be set.");
        }

        String clientAssertion = ClientAssertionHelper.createClientAssertion(
                new ClientAssertionOptions(
                        properties.getClientId(),
                        properties.getSecret(),
                        properties.resolvedBaseUrl()
                )
        );

        TokenRes tokenResponse = api.v1Oauth2TokenPost(
                clientAssertion,
                BodyOptions.DEFAULT_CLIENT_ASSERTION_TYPE,
                BodyOptions.DEFAULT_GRANT_TYPE,
                BodyOptions.DEFAULT_RESOURCE,
                BodyOptions.DEFAULT_SCOPE
        );

        stateService.set("access_token", tokenResponse.getAccessToken());
        Map<String, Object> tokenInfo = new LinkedHashMap<>();
        tokenInfo.put("clientId", properties.getClientId());
        tokenInfo.put("tokenType", tokenResponse.getTokenType());
        tokenInfo.put("expiresIn", tokenResponse.getExpiresIn());
        tokenInfo.put("scope", tokenResponse.getScope());
        tokenInfo.put("issuedAt", Instant.now().toString());
        stateService.set("token_info", tokenInfo);
        return tokenResponse;
    }

    String bearerToken() {
        Object accessToken = stateService.get("access_token");
        if (!(accessToken instanceof String token) || token.isBlank()) {
            throw new IllegalStateException("No access token found. Please call /v1/oauth2/token first.");
        }
        return "Bearer " + token;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
