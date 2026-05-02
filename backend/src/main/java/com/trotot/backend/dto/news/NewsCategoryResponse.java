package com.trotot.backend.dto.news;

import java.time.Instant;

public record NewsCategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        int displayOrder,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt) {
}
