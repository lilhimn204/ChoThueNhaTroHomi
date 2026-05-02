package com.trotot.backend.dto.user;

import java.util.Set;

import com.trotot.backend.entity.RoleName;

import jakarta.validation.constraints.NotEmpty;

public record UpdateUserRolesRequest(
        @NotEmpty(message = "Vai trò người dùng không được để trống.")
        Set<RoleName> roles) {
}
