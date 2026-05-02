package com.trotot.backend.dto.news;

import java.time.Instant;

import com.trotot.backend.entity.NewsArticleStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOrUpdateNewsArticleRequest(
        @NotBlank(message = "Tiêu đề tin tức không được để trống.")
        @Size(max = 180, message = "Tiêu đề tin tức không được vượt quá 180 ký tự.")
        String title,

        @Size(max = 220, message = "Slug không được vượt quá 220 ký tự.")
        String slug,

        @Size(max = 180, message = "Meta title không được vượt quá 180 ký tự.")
        String seoTitle,

        @Size(max = 320, message = "Meta description không được vượt quá 320 ký tự.")
        String seoDescription,

        @Size(max = 255, message = "Ảnh Open Graph không được vượt quá 255 ký tự.")
        String ogImageUrl,

        @Size(max = 255, message = "Canonical URL không được vượt quá 255 ký tự.")
        String canonicalUrl,

        @NotBlank(message = "Mô tả ngắn không được để trống.")
        @Size(max = 360, message = "Mô tả ngắn không được vượt quá 360 ký tự.")
        String summary,

        @NotBlank(message = "Nội dung tin tức không được để trống.")
        @Size(max = 20000, message = "Nội dung tin tức không được vượt quá 20000 ký tự.")
        String content,

        @Size(max = 255, message = "Ảnh đại diện không được vượt quá 255 ký tự.")
        String thumbnailUrl,

        Boolean featured,

        @NotBlank(message = "Danh mục không được để trống.")
        @Size(max = 80, message = "Danh mục không được vượt quá 80 ký tự.")
        String category,

        @NotNull(message = "Trạng thái tin tức không được để trống.")
        NewsArticleStatus status,

        Instant publishedAt,

        @NotBlank(message = "Tác giả không được để trống.")
        @Size(max = 120, message = "Tác giả không được vượt quá 120 ký tự.")
        String authorName) {
}
