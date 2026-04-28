package com.trotot.backend.dto.room;

import java.math.BigDecimal;
import java.util.List;

import com.trotot.backend.entity.RoomStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOrUpdateRoomRequest(
        @NotBlank(message = "Tiêu đề phòng không được để trống.")
        @Size(max = 180, message = "Tiêu đề phòng không được vượt quá 180 ký tự.")
        String title,

        @NotBlank(message = "Mô tả phòng không được để trống.")
        String description,

        @NotBlank(message = "Địa chỉ không được để trống.")
        @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự.")
        String address,

        @NotNull(message = "Quận/huyện không được để trống.")
        Long districtId,

        @NotNull(message = "Giá phòng không được để trống.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Giá phòng phải lớn hơn 0.")
        BigDecimal price,

        @NotNull(message = "Diện tích không được để trống.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Diện tích phải lớn hơn 0.")
        BigDecimal area,

        @NotBlank(message = "Tên người liên hệ không được để trống.")
        @Size(max = 120, message = "Tên người liên hệ không được vượt quá 120 ký tự.")
        String contactName,

        @NotBlank(message = "Số điện thoại liên hệ không được để trống.")
        @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại phải gồm 9 đến 11 chữ số.")
        String contactPhone,

        RoomStatus status,
        String thumbnail,
        Boolean featured,
        List<Long> amenityIds,
        List<@Valid RoomImageRequest> images) {
}
