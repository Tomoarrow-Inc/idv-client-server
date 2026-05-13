package com.tomoarrow.idv.bff.java.service;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tomoarrow.idv.client.generated.ApiException;
import com.tomoarrow.idv.client.generated.api.DefaultApi;
import com.tomoarrow.idv.client.generated.model.ResultReq;
import com.tomoarrow.idv.client.generated.model.ResultRes;
import com.tomoarrow.idv.client.generated.model.StartIdvReq;
import com.tomoarrow.idv.client.generated.model.StartIdvRes;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IdvServiceTest {
    @Mock
    private DefaultApi api;

    @Mock
    private TokenService tokenService;

    @Test
    void idvStartForwardsGeneratedRequestWithBearerToken() throws ApiException {
        // 이 테스트는 Java BFF가 SDK의 StartIdvReq를 변경하지 않고 TypeScript BFF와 같은 Bearer 토큰으로 전달하는지 검증한다.
        StartIdvReq request = new StartIdvReq()
                .callbackUrl("https://example.com/callback")
                .userId("user-1");
        StartIdvRes response = new StartIdvRes();
        when(tokenService.bearerToken()).thenReturn("Bearer access-token");
        when(api.v1IdvStartPost("Bearer access-token", request)).thenReturn(response);

        IdvService service = new IdvService(api, tokenService);

        assertSame(response, service.idvStart(request));
        verify(api).v1IdvStartPost("Bearer access-token", request);
    }

    @Test
    void idvResultForwardsGeneratedRequestWithBearerToken() throws ApiException {
        // 이 테스트는 Java BFF가 SDK의 ResultReq를 변경하지 않고 TypeScript BFF와 같은 Bearer 토큰으로 전달하는지 검증한다.
        ResultReq request = new ResultReq().userId("user-1");
        ResultRes response = new ResultRes();
        when(tokenService.bearerToken()).thenReturn("Bearer access-token");
        when(api.v1IdvResultPost("Bearer access-token", request)).thenReturn(response);

        IdvService service = new IdvService(api, tokenService);

        assertSame(response, service.idvResult(request));
        verify(api).v1IdvResultPost("Bearer access-token", request);
    }
}
