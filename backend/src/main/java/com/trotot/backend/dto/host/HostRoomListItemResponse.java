package com.trotot.backend.dto.host;

import java.math.BigDecimal;
import java.time.Instant;

import com.trotot.backend.entity.RoomStatus;

public record HostRoomListItemResponse(
        Long id,
        String listingCode,
        String title,
        String slug,
        String districtName,
        BigDecimal price,
        BigDecimal area,
        RoomStatus status,
        String thumbnail,
        long contactRequestCount,
        Instant postedAt,
        Instant createdAt,
        Instant updatedAt) {
}
