package com.tomoarrow.idv.bff.config

import com.tomoarrow.idv.client.apis.DefaultApi
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ApiClientConfig(
    private val appProperties: AppProperties
) {

    @Bean
    fun defaultApi(): DefaultApi {
        val baseUrl = appProperties.idvBaseUrl.trimEnd('/')
        return DefaultApi(basePath = baseUrl)
    }
}
