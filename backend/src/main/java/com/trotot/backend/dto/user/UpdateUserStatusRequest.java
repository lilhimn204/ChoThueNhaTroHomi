package com.trotot.backend.dto.user;

import com.trotot.backend.entity.UserStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
    @NotNull(message = "Trạng thái tài khoản không được để trống.")
        UserStatus status,
        Boolean enabled) {
}
