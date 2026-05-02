package com.trotot.backend.service;

import java.time.Instant;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.news.CreateOrUpdateNewsArticleRequest;
import com.trotot.backend.dto.news.NewsArticleResponse;
import com.trotot.backend.dto.news.UpdateNewsArticleStatusRequest;
import com.trotot.backend.entity.NewsArticle;
import com.trotot.backend.entity.NewsArticleStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.NewsArticleRepository;
import com.trotot.backend.repository.specification.NewsArticleSpecifications;
import com.trotot.backend.util.InputSanitizer;
import com.trotot.backend.util.SlugUtils;

@SuppressWarnings("null")
@Service
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final NewsCategoryService newsCategoryService;
    private final UserService userService;

    public NewsArticleService(
            NewsArticleRepository newsArticleRepository,
            NewsCategoryService newsCategoryService,
            UserService userService) {
        this.newsArticleRepository = newsArticleRepository;
        this.newsCategoryService = newsCategoryService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public PageResponse<NewsArticleResponse> searchPublicNews(
            String keyword,
            String category,
            int page,
            int size) {
        var pageable = PageRequest.of(
                Math.max(page, 0),
                InputSanitizer.normalizePageSize(size, 20),
                Sort.by(Sort.Direction.DESC, "featured")
                        .and(Sort.by(Sort.Direction.DESC, "publishedAt"))
                        .and(Sort.by(Sort.Direction.DESC, "createdAt")));
        var articles = newsArticleRepository.findAll(
                NewsArticleSpecifications.publicSearch(
                        InputSanitizer.trimToNull(keyword),
                        InputSanitizer.trimToNull(category)),
                pageable);
        return PageResponse.from(articles, this::toResponse);
    }

    @Transactional(readOnly = true)
    public NewsArticleResponse getPublicArticle(String slug) {
        NewsArticle article = newsArticleRepository
                .findBySlugAndStatus(slug, NewsArticleStatus.PUBLISHED)
                .filter(this::isVisibleToPublic)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tức."));

        return toResponse(article);
    }

    @Transactional(readOnly = true)
    public PageResponse<NewsArticleResponse> searchAdminNews(
            String keyword,
            String category,
            NewsArticleStatus status,
            int page,
            int size) {
        var pageable = PageRequest.of(
                Math.max(page, 0),
                InputSanitizer.normalizePageSize(size, 50),
                Sort.by(Sort.Direction.DESC, "updatedAt").and(Sort.by(Sort.Direction.DESC, "createdAt")));
        var articles = newsArticleRepository.findAll(
                NewsArticleSpecifications.adminSearch(
                        InputSanitizer.trimToNull(keyword),
                        InputSanitizer.trimToNull(category),
                        status),
                pageable);
        return PageResponse.from(articles, this::toResponse);
    }

    @Transactional(readOnly = true)
    public NewsArticleResponse getAdminArticle(Long articleId) {
        return toResponse(getRequiredArticle(articleId));
    }

    @Transactional
    public NewsArticleResponse createArticle(
            CreateOrUpdateNewsArticleRequest request,
            Long adminUserId) {
        User admin = userService.getRequiredUserEntity(adminUserId);
        NewsArticle article = new NewsArticle();
        article.setCreatedBy(admin);
        article.setUpdatedBy(admin);
        article.setLastEditedAt(Instant.now());
        applyRequest(article, request, null);

        return toResponse(newsArticleRepository.save(article));
    }

    @Transactional
    public NewsArticleResponse updateArticle(
            Long articleId,
            CreateOrUpdateNewsArticleRequest request,
            Long adminUserId) {
        User admin = userService.getRequiredUserEntity(adminUserId);
        NewsArticle article = getRequiredArticle(articleId);
        article.setUpdatedBy(admin);
        article.setLastEditedAt(Instant.now());
        applyRequest(article, request, articleId);

        return toResponse(newsArticleRepository.save(article));
    }

    @Transactional
    public NewsArticleResponse updateStatus(
            Long articleId,
            UpdateNewsArticleStatusRequest request,
            Long adminUserId) {
        User admin = userService.getRequiredUserEntity(adminUserId);
        NewsArticle article = getRequiredArticle(articleId);
        article.setStatus(request.status());
        article.setUpdatedBy(admin);
        article.setLastEditedAt(Instant.now());

        if (request.status() == NewsArticleStatus.PUBLISHED && article.getPublishedAt() == null) {
            article.setPublishedAt(Instant.now());
        }

        return toResponse(newsArticleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(Long articleId) {
        NewsArticle article = getRequiredArticle(articleId);
        newsArticleRepository.delete(article);
    }

    private void applyRequest(
            NewsArticle article,
            CreateOrUpdateNewsArticleRequest request,
            Long currentArticleId) {
        String title = InputSanitizer.sanitizeRequired(request.title());
        String requestedSlug = InputSanitizer.sanitize(request.slug());

        article.setTitle(title);
        article.setSlug(generateUniqueSlug(requestedSlug == null ? title : requestedSlug, currentArticleId));
        article.setSeoTitle(InputSanitizer.sanitize(request.seoTitle()));
        article.setSeoDescription(InputSanitizer.sanitize(request.seoDescription()));
        article.setOgImageUrl(InputSanitizer.sanitize(request.ogImageUrl()));
        article.setCanonicalUrl(InputSanitizer.sanitize(request.canonicalUrl()));
        article.setSummary(InputSanitizer.sanitizeRequired(request.summary()));
        article.setContent(InputSanitizer.sanitizeRequiredMultiline(request.content()));
        article.setThumbnailUrl(InputSanitizer.sanitize(request.thumbnailUrl()));
        article.setFeatured(Boolean.TRUE.equals(request.featured()));
        String category = InputSanitizer.sanitizeRequired(request.category());
        if (!newsCategoryService.categoryExists(category)) {
            throw new BusinessException("Danh mục tin tức không tồn tại.");
        }
        article.setCategory(category);
        article.setStatus(request.status());
        article.setAuthorName(InputSanitizer.sanitizeRequired(request.authorName()));
        article.setPublishedAt(resolvePublishedAt(request));
    }

    private Instant resolvePublishedAt(CreateOrUpdateNewsArticleRequest request) {
        if (request.status() == NewsArticleStatus.PUBLISHED) {
            return request.publishedAt() == null ? Instant.now() : request.publishedAt();
        }

        return request.publishedAt();
    }

    private String generateUniqueSlug(String title, Long currentArticleId) {
        String baseSlug = SlugUtils.toSlug(title);

        if ("room".equals(baseSlug)) {
            baseSlug = "tin-tuc";
        }

        String slug = baseSlug;
        int suffix = 2;

        while (slugExists(slug, currentArticleId)) {
            slug = baseSlug + "-" + suffix;
            suffix += 1;
        }

        return slug;
    }

    private boolean slugExists(String slug, Long currentArticleId) {
        return currentArticleId == null
                ? newsArticleRepository.existsBySlug(slug)
                : newsArticleRepository.existsBySlugAndIdNot(slug, currentArticleId);
    }

    private boolean isVisibleToPublic(NewsArticle article) {
        return article.getPublishedAt() == null || !article.getPublishedAt().isAfter(Instant.now());
    }

    private NewsArticle getRequiredArticle(Long articleId) {
        return newsArticleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tức với id = " + articleId));
    }

    private NewsArticleResponse toResponse(NewsArticle article) {
        return new NewsArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getSlug(),
                article.getSeoTitle(),
                article.getSeoDescription(),
                article.getOgImageUrl(),
                article.getCanonicalUrl(),
                article.getSummary(),
                article.getContent(),
                article.getThumbnailUrl(),
                article.isFeatured(),
                article.getCategory(),
                article.getStatus(),
                article.getPublishedAt(),
                article.getAuthorName(),
                article.getCreatedBy() == null ? null : article.getCreatedBy().getFullName(),
                article.getUpdatedBy() == null ? null : article.getUpdatedBy().getFullName(),
                article.getLastEditedAt(),
                article.getCreatedAt(),
                article.getUpdatedAt());
    }
}
