package com.trotot.backend.dto.host;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateHostProfileRequest(
        @NotBlank(message = "Họ tên không được để trống.")
        @Size(max = 120, message = "Họ tên không được vượt quá 120 ký tự.")
        String fullName,

        @Pattern(regexp = "^$|^[0-9]{9,11}$", message = "Số điện thoại phải gồm 9 đến 11 chữ số.")
        String phone,

        @Size(max = 255, message = "Avatar URL không được vượt quá 255 ký tự.")
        String avatarUrl,

        @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự.")
        String address,

        @Size(max = 500, message = "Mô tả người cho thuê không được vượt quá 500 ký tự.")
        String hostBio) {
}
