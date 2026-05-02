package com.trotot.backend.dto.support;

import com.trotot.backend.entity.SupportTicketStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateSupportTicketStatusRequest(
        @NotNull(message = "Trạng thái không được để trống.")
        SupportTicketStatus status,

        @Size(max = 600, message = "Ghi chú admin không được vượt quá 600 ký tự.")
        String adminNote) {
}
