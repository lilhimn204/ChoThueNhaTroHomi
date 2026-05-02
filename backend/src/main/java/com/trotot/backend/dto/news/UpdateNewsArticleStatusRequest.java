package com.trotot.backend.dto.news;

import com.trotot.backend.entity.NewsArticleStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateNewsArticleStatusRequest(
        @NotNull(message = "Trạng thái tin tức không được để trống.")
        NewsArticleStatus status) {
}
