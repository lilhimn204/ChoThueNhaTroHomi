package com.trotot.backend.dto.support;

import com.trotot.backend.entity.SupportTicketType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSupportTicketRequest(
        @NotNull(message = "Loại yêu cầu không được để trống.")
        SupportTicketType type,

        @Size(max = 255, message = "Mã tin hoặc link bài đăng không được vượt quá 255 ký tự.")
        String listingReference,

        @Size(max = 120, message = "Lý do không được vượt quá 120 ký tự.")
        String reason,

        @Size(max = 120, message = "Họ tên không được vượt quá 120 ký tự.")
        String fullName,

        @Email(message = "Email không hợp lệ.")
        @Size(max = 120, message = "Email không được vượt quá 120 ký tự.")
        String email,

        @Pattern(regexp = "^$|^[0-9]{9,11}$", message = "Số điện thoại phải gồm 9 đến 11 chữ số.")
        String phone,

        @Size(max = 180, message = "Tiêu đề không được vượt quá 180 ký tự.")
        String subject,

        @Size(max = 1500, message = "Nội dung không được vượt quá 1500 ký tự.")
        String message) {
}
