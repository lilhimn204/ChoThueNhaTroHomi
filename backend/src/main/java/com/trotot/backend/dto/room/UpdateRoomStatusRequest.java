package com.trotot.backend.dto.room;

import com.trotot.backend.entity.RoomStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateRoomStatusRequest(
    @NotNull(message = "Trạng thái phòng không được để trống.")
        RoomStatus status) {
}
