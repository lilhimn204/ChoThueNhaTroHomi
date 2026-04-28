package com.trotot.backend.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInMinutes,
        long refreshExpiresInMinutes,
        AuthUserResponse user) {
}
