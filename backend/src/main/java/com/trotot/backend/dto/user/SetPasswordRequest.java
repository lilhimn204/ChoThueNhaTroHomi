package com.trotot.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SetPasswordRequest(
        @NotBlank(message = "Mật khẩu mới không được để trống.")
        @Size(min = 6, max = 100, message = "Mật khẩu mới phải có từ 6 đến 100 ký tự.")
        String newPassword,

        @NotBlank(message = "Xác nhận mật khẩu không được để trống.")
        String confirmPassword) {
}
