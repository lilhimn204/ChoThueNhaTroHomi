package com.trotot.backend.dto.news;

import java.time.Instant;

import com.trotot.backend.entity.NewsArticleStatus;

public record NewsArticleResponse(
        Long id,
        String title,
        String slug,
        String seoTitle,
        String seoDescription,
        String ogImageUrl,
        String canonicalUrl,
        String summary,
        String content,
        String thumbnailUrl,
        boolean featured,
        String category,
        NewsArticleStatus status,
        Instant publishedAt,
        String authorName,
        String createdByName,
        String updatedByName,
        Instant lastEditedAt,
        Instant createdAt,
        Instant updatedAt) {
}
