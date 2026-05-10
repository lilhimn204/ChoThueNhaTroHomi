package com.trotot.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.trotot.backend.config.AppProperties;

import jakarta.annotation.PostConstruct;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final int MIN_SECRET_LENGTH = 32;
    private static final List<String> PLACEHOLDER_MARKERS = List.of(
            "change-this",
            "please-change",
            "rental-room-demo-secret");

    private final AppProperties appProperties;
    private final Environment environment;

    public JwtService(AppProperties appProperties, Environment environment) {
        this.appProperties = appProperties;
        this.environment = environment;
    }

    @PostConstruct
    void validateSecret() {
        String secret = appProperties.getJwt().getSecret();

        if (secret == null || secret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException(
                    "JWT secret must be at least " + MIN_SECRET_LENGTH + " characters. "
                    + "Set a strong value via JWT_SECRET environment variable.");
        }

        if (isPlaceholderSecret(secret)) {
            String message = "JWT secret appears to be a placeholder. Set a strong JWT_SECRET before deploying.";

            if (isProductionProfile()) {
                throw new IllegalStateException(message);
            }

            log.warn("{}", message);
        }
    }

    private boolean isProductionProfile() {
        return Arrays.stream(environment.getActiveProfiles())
                .map(String::toLowerCase)
                .anyMatch(profile -> profile.equals("prod") || profile.equals("production"));
    }

    private boolean isPlaceholderSecret(String secret) {
        String normalizedSecret = secret.toLowerCase();

        return PLACEHOLDER_MARKERS.stream().anyMatch(normalizedSecret::contains);
    }

    public String generateToken(UserPrincipal principal) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(appProperties.getJwt().getExpirationMinutes() * 60);
        List<String> roles = principal.getAuthorities().stream().map(Object::toString).toList();

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("uid", principal.getId())
                .claim("name", principal.getFullName())
                .claim("roles", roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserPrincipal principal) {
        String username = extractUsername(token);
        return username.equals(principal.getUsername()) && !isTokenExpired(token);
    }

    public long getExpirationMinutes() {
        return appProperties.getJwt().getExpirationMinutes();
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
