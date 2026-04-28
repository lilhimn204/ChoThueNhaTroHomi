package com.trotot.backend.dto.host;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.dto.room.RoomImageResponse;
import com.trotot.backend.entity.RoomStatus;

public record HostRoomResponse(
        Long id,
        String listingCode,
        String title,
        String slug,
        String description,
        String address,
        Long districtId,
        String districtName,
        BigDecimal price,
        BigDecimal area,
        String contactName,
        String contactPhone,
        RoomStatus status,
        String thumbnail,
        List<AmenityResponse> amenities,
        List<RoomImageResponse> images,
        Instant postedAt,
        Instant createdAt,
        Instant updatedAt) {
}
