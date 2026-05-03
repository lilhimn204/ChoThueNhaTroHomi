package com.trotot.backend.dto.auth;

import java.util.Set;

import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.UserStatus;

public record AuthUserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        UserStatus status,
        AuthProvider authProvider,
        boolean passwordConfigured,
        Set<String> roles) {
}
