package com.trotot.backend.dto.room;

import java.math.BigDecimal;
import java.time.Instant;

import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.RoomType;

public record AdminRoomListItemResponse(
        Long id,
        String listingCode,
        String title,
        String slug,
        String districtName,
        BigDecimal price,
        BigDecimal area,
        RoomType roomType,
        RoomStatus status,
        boolean featured,
        String contactName,
        Instant postedAt,
        Instant createdAt) {
}
