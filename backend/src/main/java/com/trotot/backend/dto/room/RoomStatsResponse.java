package com.trotot.backend.dto.room;

public record RoomStatsResponse(
        long visibleRooms,
        long availableRooms,
        int availableRate) {
}
