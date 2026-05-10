package com.trotot.backend.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import com.trotot.backend.config.AppProperties;

@DisplayName("JwtService - secret validation")
class JwtServiceTest {

    @Test
    @DisplayName("Production profile rejects placeholder JWT secret")
    void validateSecret_prodProfileWithPlaceholder_throws() {
        AppProperties properties = propertiesWithSecret(
                "change-this-secret-before-deploying-homi-with-at-least-32-characters");
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        JwtService service = new JwtService(properties, environment);

        assertThrows(IllegalStateException.class, service::validateSecret);
    }

    @Test
    @DisplayName("Production profile accepts strong JWT secret")
    void validateSecret_prodProfileWithStrongSecret_passes() {
        AppProperties properties = propertiesWithSecret(
                "homi-production-secret-with-enough-entropy-2026-05-10");
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        JwtService service = new JwtService(properties, environment);

        assertDoesNotThrow(service::validateSecret);
    }

    @Test
    @DisplayName("Non-production profile only warns on placeholder JWT secret")
    void validateSecret_nonProdPlaceholder_passes() {
        AppProperties properties = propertiesWithSecret(
                "rental-room-demo-secret-key-please-change-before-production-2026");
        MockEnvironment environment = new MockEnvironment();

        JwtService service = new JwtService(properties, environment);

        assertDoesNotThrow(service::validateSecret);
    }

    @Test
    @DisplayName("Any profile rejects short JWT secret")
    void validateSecret_shortSecret_throws() {
        AppProperties properties = propertiesWithSecret("short");
        MockEnvironment environment = new MockEnvironment();

        JwtService service = new JwtService(properties, environment);

        assertThrows(IllegalStateException.class, service::validateSecret);
    }

    private AppProperties propertiesWithSecret(String secret) {
        AppProperties properties = new AppProperties();
        properties.getJwt().setSecret(secret);
        return properties;
    }
}
