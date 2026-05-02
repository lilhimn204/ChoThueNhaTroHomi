package com.trotot.backend.repository.specification;

import java.time.Instant;

import org.springframework.data.jpa.domain.Specification;

import com.trotot.backend.entity.NewsArticle;
import com.trotot.backend.entity.NewsArticleStatus;

public final class NewsArticleSpecifications {

    private NewsArticleSpecifications() {
    }

    public static Specification<NewsArticle> publicSearch(String keyword, String category) {
        return publishedVisibleNow()
                .and(hasKeyword(keyword))
                .and(hasCategory(category));
    }

    public static Specification<NewsArticle> adminSearch(
            String keyword,
            String category,
            NewsArticleStatus status) {
        return hasKeyword(keyword)
                .and(hasCategory(category))
                .and(hasStatus(status));
    }

    private static Specification<NewsArticle> publishedVisibleNow() {
        return (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), NewsArticleStatus.PUBLISHED),
                cb.or(
                        cb.isNull(root.get("publishedAt")),
                        cb.lessThanOrEqualTo(root.get("publishedAt"), Instant.now())));
    }

    private static Specification<NewsArticle> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("summary")), pattern),
                    cb.like(cb.lower(root.get("content")), pattern),
                    cb.like(cb.lower(root.get("category")), pattern),
                    cb.like(cb.lower(root.get("authorName")), pattern));
        };
    }

    private static Specification<NewsArticle> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isBlank()) {
                return cb.conjunction();
            }

            return cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase());
        };
    }

    private static Specification<NewsArticle> hasStatus(NewsArticleStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }
}
