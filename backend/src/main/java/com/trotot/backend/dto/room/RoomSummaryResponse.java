package com.trotot.backend.dto.room;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.RoomType;

public record RoomSummaryResponse(
        Long id,
        String listingCode,
        String slug,
        String title,
        String districtName,
        String address,
        BigDecimal price,
        BigDecimal area,
        RoomType roomType,
        RoomStatus status,
        String thumbnail,
        boolean featured,
        Instant postedAt,
        List<String> highlightAmenities) {
}
