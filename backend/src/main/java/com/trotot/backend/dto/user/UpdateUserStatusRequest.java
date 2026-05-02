package com.trotot.backend.dto.user;

import com.trotot.backend.entity.UserStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateUserStatusRequest(
        @NotNull(message = "Trạng thái tài khoản không được để trống.")
        UserStatus status,
        Boolean enabled,
        @Size(max = 300, message = "Lý do khóa không được vượt quá 300 ký tự.")
        String lockReason) {
}
