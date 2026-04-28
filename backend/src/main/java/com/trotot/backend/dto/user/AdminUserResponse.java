package com.trotot.backend.dto.user;

import java.time.Instant;
import java.util.Set;

import com.trotot.backend.entity.UserStatus;

public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        UserStatus status,
        boolean enabled,
        Set<String> roles,
        Instant createdAt) {
}
