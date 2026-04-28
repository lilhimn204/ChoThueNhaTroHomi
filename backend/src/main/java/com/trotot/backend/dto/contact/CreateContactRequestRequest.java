package com.trotot.backend.dto.contact;

import com.trotot.backend.entity.ContactRequestType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateContactRequestRequest(
        @NotNull(message = "Phòng trọ không được để trống.")
        Long roomId,

        ContactRequestType requestType,

        @NotBlank(message = "Họ tên không được để trống.")
        @Size(max = 120, message = "Họ tên không được vượt quá 120 ký tự.")
        String fullName,

        @Email(message = "Email không hợp lệ.")
        @Size(max = 120, message = "Email không được vượt quá 120 ký tự.")
        String email,

        @NotBlank(message = "Số điện thoại không được để trống.")
        @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại phải gồm 9 đến 11 chữ số.")
        String phone,

        @Size(max = 1000, message = "Nội dung lời nhắn không được vượt quá 1000 ký tự.")
        String message,

        @Size(max = 120, message = "Thời gian xem phòng không được vượt quá 120 ký tự.")
        String preferredViewingTime) {
}
