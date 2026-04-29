package com.tomoarrow.idv.bff.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val idvBaseUrl: String = "http://localhost",
    val tomoIdvClientId: String = "",
    val tomoIdvSecret: String = "",
    val testBoardPath: String = "../../test-board/test-board.html"
)
