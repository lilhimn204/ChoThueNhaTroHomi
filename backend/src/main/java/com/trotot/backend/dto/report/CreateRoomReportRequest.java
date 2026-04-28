package com.trotot.backend.dto.report;

import com.trotot.backend.entity.RoomReportReason;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRoomReportRequest(
        @NotNull(message = "Phòng trọ không được để trống.")
        Long roomId,

        @NotNull(message = "Lý do báo cáo không được để trống.")
        RoomReportReason reason,

        @Size(max = 1000, message = "Nội dung báo cáo không được vượt quá 1000 ký tự.")
        String details) {
}
