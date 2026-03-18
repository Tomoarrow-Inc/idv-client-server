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
}
