package com.tomoarrow.idv.bff.java.controller;

import com.tomoarrow.idv.bff.java.service.TokenService;
import com.tomoarrow.idv.client.generated.ApiException;
import com.tomoarrow.idv.client.generated.model.TokenRes;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuthController {
    private final TokenService tokenService;

    public OAuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/v1/oauth2/token")
    TokenRes issueClientCredentialsToken() throws ApiException {
        return tokenService.issueClientCredentialsToken();
    }
}
