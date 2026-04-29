package com.trotot.backend.dto.auth;

public record RegistrationOtpResponse(
        String email,
        long expiresInMinutes,
        long resendCooldownSeconds,
        String message) {
}
