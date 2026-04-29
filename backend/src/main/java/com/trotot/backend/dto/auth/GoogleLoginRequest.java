package com.trotot.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank(message = "Google token không được để trống.")
        String idToken) {
}
