package com.trotot.backend.dto.host;

import java.time.Instant;

public record HostProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        String address,
        String hostBio,
        Instant createdAt) {
}
