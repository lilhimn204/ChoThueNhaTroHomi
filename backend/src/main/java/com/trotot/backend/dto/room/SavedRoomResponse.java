package com.trotot.backend.dto.room;

import java.time.Instant;

public record SavedRoomResponse(
        Long roomId,
        String listingCode,
        String title,
        String slug,
        String districtName,
        String address,
        java.math.BigDecimal price,
        java.math.BigDecimal area,
        com.trotot.backend.entity.RoomStatus status,
        String thumbnail,
        Instant postedAt,
        Instant savedAt) {
}
