package com.trotot.backend.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoomImageRequest(
    @NotBlank(message = "URL ảnh không được để trống.")
    @Size(max = 255, message = "URL ảnh không được vượt quá 255 ký tự.")
        String imageUrl,

    @Size(max = 150, message = "Alt text không được vượt quá 150 ký tự.")
        String altText,

        Integer sortOrder,
        Boolean isThumbnail) {
}
