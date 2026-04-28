package com.trotot.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.Instant;

import com.trotot.backend.entity.RoomStatus;

public record RecentRoomResponse(
        Long id,
        String title,
        String slug,
        String districtName,
        BigDecimal price,
        RoomStatus status,
        Instant createdAt) {
}
