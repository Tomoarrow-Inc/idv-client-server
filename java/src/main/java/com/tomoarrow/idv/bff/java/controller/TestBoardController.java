package com.tomoarrow.idv.bff.java.controller;

import com.tomoarrow.idv.bff.java.config.AppProperties;
import java.nio.file.Path;
import java.util.Map;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestBoardController {
    private final AppProperties properties;

    public TestBoardController(AppProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/")
    Map<String, String> hello() {
        return Map.of("message", "Hello World!");
    }

    @GetMapping("/test-board")
    ResponseEntity<Resource> testBoard() {
        Resource resource = new FileSystemResource(Path.of(properties.getTestBoardPath()));
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }

    @GetMapping("/test-board/config")
    Map<String, String> testBoardConfig() {
        return Map.of(
                "idvServerUrl", properties.resolvedBaseUrl(),
                "idvAppUrl", properties.getAppUrl() == null ? "" : properties.getAppUrl()
        );
    }
}
