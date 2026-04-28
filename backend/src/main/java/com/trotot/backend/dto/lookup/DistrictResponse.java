package com.trotot.backend.dto.lookup;

public record DistrictResponse(
        Long id,
        String name,
        String slug,
        String cityName) {
}
