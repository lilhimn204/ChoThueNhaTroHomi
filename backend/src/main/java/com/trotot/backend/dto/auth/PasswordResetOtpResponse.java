package com.trotot.backend.dto.auth;

public record PasswordResetOtpResponse(
        String email,
        long expiresInMinutes,
        long resendCooldownSeconds,
        String message) {
}
