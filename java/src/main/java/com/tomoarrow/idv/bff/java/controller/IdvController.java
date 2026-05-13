package com.tomoarrow.idv.bff.java.controller;

import com.tomoarrow.idv.bff.java.service.IdvService;
import com.tomoarrow.idv.client.generated.ApiException;
import com.tomoarrow.idv.client.generated.model.ResultReq;
import com.tomoarrow.idv.client.generated.model.ResultRes;
import com.tomoarrow.idv.client.generated.model.StartIdvReq;
import com.tomoarrow.idv.client.generated.model.StartIdvRes;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IdvController {
    private final IdvService idvService;

    public IdvController(IdvService idvService) {
        this.idvService = idvService;
    }

    @PostMapping("/v1/idv/start")
    StartIdvRes idvStart(@RequestBody StartIdvReq body) throws ApiException {
        return idvService.idvStart(body);
    }

    @PostMapping("/v1/idv/result")
    ResultRes idvResult(@RequestBody ResultReq body) throws ApiException {
        return idvService.idvResult(body);
    }
}
