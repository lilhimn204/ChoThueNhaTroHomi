package com.trotot.backend.dto.host;

import com.trotot.backend.entity.ContactRequestStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateHostContactRequestStatusRequest(
        @NotNull(message = "Trạng thái xử lý không được để trống.")
        ContactRequestStatus status,

        @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự.")
        String note) {
}
