package com.trotot.backend.dto.report;

import com.trotot.backend.entity.RoomReportStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateRoomReportStatusRequest(
        @NotNull(message = "Trạng thái báo cáo không được để trống.")
        RoomReportStatus status,

        @Size(max = 500, message = "Ghi chú xử lý không được vượt quá 500 ký tự.")
        String adminNote) {
}
