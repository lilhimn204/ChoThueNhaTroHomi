package com.trotot.backend.dto.lookup;

import com.trotot.backend.entity.AmenityCategory;

public record AmenityResponse(
        Long id,
        String name,
        String slug,
        AmenityCategory category,
        String iconKey) {
}
