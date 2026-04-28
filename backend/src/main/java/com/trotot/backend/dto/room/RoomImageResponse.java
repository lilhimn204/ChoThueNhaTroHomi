package com.trotot.backend.dto.room;

public record RoomImageResponse(
        Long id,
        String imageUrl,
        String altText,
        int sortOrder,
        boolean isThumbnail) {
}
