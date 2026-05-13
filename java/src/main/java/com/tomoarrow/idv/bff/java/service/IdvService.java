package com.tomoarrow.idv.bff.java.service;

import com.tomoarrow.idv.client.generated.ApiException;
import com.tomoarrow.idv.client.generated.api.DefaultApi;
import com.tomoarrow.idv.client.generated.model.ResultReq;
import com.tomoarrow.idv.client.generated.model.ResultRes;
import com.tomoarrow.idv.client.generated.model.StartIdvReq;
import com.tomoarrow.idv.client.generated.model.StartIdvRes;
import org.springframework.stereotype.Service;

@Service
public class IdvService {
    private final DefaultApi api;
    private final TokenService tokenService;

    public IdvService(DefaultApi api, TokenService tokenService) {
        this.api = api;
        this.tokenService = tokenService;
    }

    public StartIdvRes idvStart(StartIdvReq body) throws ApiException {
        return api.v1IdvStartPost(tokenService.bearerToken(), body);
    }

    public ResultRes idvResult(ResultReq body) throws ApiException {
        return api.v1IdvResultPost(tokenService.bearerToken(), body);
    }
}
