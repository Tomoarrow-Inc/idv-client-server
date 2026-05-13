package com.tomoarrow.idv.bff.java.config;

import com.tomoarrow.idv.client.generated.ApiClient;
import com.tomoarrow.idv.client.generated.api.DefaultApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiClientConfig {
    @Bean
    ApiClient idvApiClient(AppProperties properties) {
        ApiClient apiClient = new ApiClient();
        apiClient.updateBaseUri(properties.resolvedBaseUrl());
        return apiClient;
    }

    @Bean
    DefaultApi defaultApi(ApiClient apiClient) {
        return new DefaultApi(apiClient);
    }
}
