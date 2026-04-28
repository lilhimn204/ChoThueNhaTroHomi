package com.trotot.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Họ tên không được để trống.")
        @Size(max = 120, message = "Họ tên không được vượt quá 120 ký tự.")
        String fullName,

        @NotBlank(message = "Email không được để trống.")
        @Email(message = "Email không hợp lệ.")
        String email,

        @NotBlank(message = "Mật khẩu không được để trống.")
        @Size(min = 6, max = 100, message = "Mật khẩu phải có từ 6 đến 100 ký tự.")
        String password,

        @Pattern(
                regexp = "^$|^[0-9]{9,11}$",
                message = "Số điện thoại phải gồm 9 đến 11 chữ số.")
        String phone) {
}
