package com.trotot.backend.dto.room;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.trotot.backend.entity.RoomStatus;

public record RoomSummaryResponse(
        Long id,
        String listingCode,
        String slug,
        String title,
        String districtName,
        String address,
        BigDecimal price,
        BigDecimal area,
        RoomStatus status,
        String thumbnail,
        boolean featured,
        Instant postedAt,
        List<String> highlightAmenities) {
}
