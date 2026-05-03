package com.trotot.backend.dto.user;

import java.time.Instant;
import java.util.Set;

import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.UserStatus;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        UserStatus status,
        boolean enabled,
        AuthProvider authProvider,
        boolean passwordConfigured,
        Set<String> roles,
        Instant createdAt) {
}
