package com.trotot.backend.dto.host;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.dto.room.RoomImageResponse;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.RoomType;

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
        RoomType roomType,
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
