package com.tomoarrow.idv.bff.java.controller;

import com.tomoarrow.idv.client.generated.ApiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<String> handleApiException(ApiException error) {
        int status = error.getCode() > 0 ? error.getCode() : HttpStatus.BAD_GATEWAY.value();
        HttpHeaders headers = new HttpHeaders();
        if (error.getResponseHeaders() != null) {
            error.getResponseHeaders()
                    .firstValue(HttpHeaders.CONTENT_TYPE)
                    .ifPresent(value -> headers.add(HttpHeaders.CONTENT_TYPE, value));
        }
        String body = error.getResponseBody() != null ? error.getResponseBody() : error.getMessage();
        return ResponseEntity.status(status).headers(headers).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<String> handleRuntimeException(RuntimeException error) {
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(error.getMessage());
    }
}
