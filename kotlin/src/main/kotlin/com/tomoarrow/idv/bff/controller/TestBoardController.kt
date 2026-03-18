package com.tomoarrow.idv.bff.controller

import com.tomoarrow.idv.bff.config.AppProperties
import org.springframework.core.io.FileSystemResource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.io.File

@RestController
class TestBoardController(
    private val appProperties: AppProperties
) {

    @GetMapping("/test-board", produces = [MediaType.TEXT_HTML_VALUE])
    fun testBoard(): ResponseEntity<FileSystemResource> {
        val file = File(appProperties.testBoardPath)
        if (!file.exists()) {
            return ResponseEntity.notFound().build()
        }
        return ResponseEntity.ok(FileSystemResource(file))
    }

    @GetMapping("/test-board/config", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun testBoardConfig(): Map<String, String> {
        return mapOf(
            "idv_base_url" to appProperties.idvBaseUrl,
            "google_client_id" to appProperties.googleClientId,
            "idv_app_url" to appProperties.idvAppUrl,
            "wechat_app_id" to appProperties.wechatAppId
        )
    }

    @GetMapping("/env", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun env(): Map<String, Any> {
        return mapOf(
            "app" to mapOf(
                "idv_base_url" to appProperties.idvBaseUrl,
                "tomo_idv_client_id" to appProperties.tomoIdvClientId,
                "tomo_idv_secret" to if (appProperties.tomoIdvSecret.isNotEmpty()) "***${appProperties.tomoIdvSecret.takeLast(8)}" else "",
                "google_client_id" to appProperties.googleClientId,
                "idv_app_url" to appProperties.idvAppUrl,
                "wechat_app_id" to appProperties.wechatAppId,
                "test_board_path" to appProperties.testBoardPath
            ),
            "server" to mapOf(
                "port" to (System.getenv("PORT") ?: "3000"),
                "profile" to (System.getenv("SPRING_PROFILES_ACTIVE") ?: "default")
            )
        )
    }
}
