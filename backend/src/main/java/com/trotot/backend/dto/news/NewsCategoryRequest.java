package com.trotot.backend.dto.news;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewsCategoryRequest(
        @NotBlank(message = "Tên danh mục không được để trống.")
        @Size(max = 80, message = "Tên danh mục không được vượt quá 80 ký tự.")
        String name,

        @Size(max = 300, message = "Mô tả danh mục không được vượt quá 300 ký tự.")
        String description,

        Integer displayOrder,
        Boolean enabled) {
}
