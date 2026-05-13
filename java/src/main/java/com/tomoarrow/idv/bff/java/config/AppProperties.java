package com.tomoarrow.idv.bff.java.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "idv")
public class AppProperties {
    private String baseUrl = "http://idv-server-ghci";
    private String appUrl = "";
    private String testBoardPath = "../test-board/test-board.html";
    private String clientId = "";
    private String secret = "";

    public String resolvedBaseUrl() {
        return baseUrl == null ? "" : baseUrl.replaceAll("/+$", "");
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public String getTestBoardPath() {
        return testBoardPath;
    }

    public void setTestBoardPath(String testBoardPath) {
        this.testBoardPath = testBoardPath;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
}
