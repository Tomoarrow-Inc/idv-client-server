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

    // test-board.html expects camelCase keys — bypass Jackson SNAKE_CASE by returning raw JSON
    @GetMapping("/test-board/config", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun testBoardConfig(): ResponseEntity<String> {
        val json = """{"googleClientId":"${appProperties.googleClientId}","idvServerUrl":"${appProperties.idvBaseUrl}"}"""
        return ResponseEntity.ok(json)
    }
}
