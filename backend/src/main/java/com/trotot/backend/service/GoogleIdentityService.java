package com.trotot.backend.service;

import java.time.Instant;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.exception.BusinessException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GoogleIdentityService {

    private static final String GOOGLE_TOKENINFO_BASE_URL = "https://oauth2.googleapis.com";

    private final RestClient restClient;
    private final AppProperties appProperties;

    public GoogleIdentityService(RestClient.Builder restClientBuilder, AppProperties appProperties) {
        this.restClient = restClientBuilder.baseUrl(GOOGLE_TOKENINFO_BASE_URL).build();
        this.appProperties = appProperties;
    }

    public GoogleAccount verify(String idToken) {
        String clientId = appProperties.getGoogle().getClientId();
        if (!StringUtils.hasText(clientId)) {
            throw new BusinessException("Đăng nhập Google chưa được cấu hình.");
        }

        Map<String, Object> payload = fetchTokenInfo(idToken);
        return validatePayload(payload, clientId);
    }

    private Map<String, Object> fetchTokenInfo(String idToken) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/tokeninfo")
                            .queryParam("id_token", idToken)
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {
                    });
        } catch (RestClientResponseException exception) {
            log.warn("Google token verification failed with status {}.", exception.getStatusCode());
            throw new BusinessException("Đăng nhập Google thất bại. Vui lòng thử lại.");
        } catch (RestClientException exception) {
            log.warn("Google token verification request failed: {}", exception.getMessage());
            throw new BusinessException("Không thể xác minh tài khoản Google. Vui lòng thử lại sau.");
        }
    }

    private GoogleAccount validatePayload(Map<String, Object> payload, String clientId) {
        if (payload == null || payload.isEmpty()) {
            throw new BusinessException("Đăng nhập Google thất bại. Vui lòng thử lại.");
        }

        String audience = asString(payload.get("aud"));
        if (!clientId.equals(audience)) {
            throw new BusinessException("Google token không đúng ứng dụng Homi.");
        }

        String googleId = asString(payload.get("sub"));
        String email = asString(payload.get("email"));
        boolean emailVerified = Boolean.parseBoolean(asString(payload.get("email_verified")));

        if (!StringUtils.hasText(googleId) || !StringUtils.hasText(email)) {
            throw new BusinessException("Google token thiếu thông tin tài khoản.");
        }

        if (!emailVerified) {
            throw new BusinessException("Email Google chưa được xác minh.");
        }

        Long expiresAt = asLong(payload.get("exp"));
        if (expiresAt != null && Instant.now().isAfter(Instant.ofEpochSecond(expiresAt))) {
            throw new BusinessException("Phiên đăng nhập Google đã hết hạn. Vui lòng thử lại.");
        }

        return new GoogleAccount(
                googleId,
                email.trim().toLowerCase(),
                asString(payload.get("name")),
                asString(payload.get("picture")));
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private Long asLong(Object value) {
        if (value == null) {
            return null;
        }

        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    public record GoogleAccount(
            String googleId,
            String email,
            String fullName,
            String avatarUrl) {
    }
}
