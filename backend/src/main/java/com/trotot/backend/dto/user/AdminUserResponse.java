package com.trotot.backend.dto.user;

import java.time.Instant;
import java.util.Set;

import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.UserStatus;

public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        String address,
        String hostBio,
        boolean emailVerified,
        AuthProvider authProvider,
        UserStatus status,
        boolean enabled,
        String lockReason,
        Instant lockedAt,
        Set<String> roles,
        Instant createdAt,
        Instant updatedAt) {
}
