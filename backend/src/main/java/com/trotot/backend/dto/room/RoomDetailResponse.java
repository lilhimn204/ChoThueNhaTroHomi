package com.trotot.backend.dto.room;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.entity.RoomStatus;

public record RoomDetailResponse(
        Long id,
        String listingCode,
        String slug,
        String title,
        String description,
        String address,
        Long districtId,
        String districtName,
        String cityName,
        BigDecimal price,
        BigDecimal area,
        String contactName,
        String contactPhone,
        RoomStatus status,
        String thumbnail,
        boolean featured,
        List<AmenityResponse> amenities,
        List<RoomImageResponse> images,
        Instant postedAt,
        Instant createdAt,
        Instant updatedAt,
        Long ownerId) {
}
