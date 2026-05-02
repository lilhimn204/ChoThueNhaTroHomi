package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.MessageResponse;
import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.news.CreateOrUpdateNewsArticleRequest;
import com.trotot.backend.dto.news.NewsArticleResponse;
import com.trotot.backend.dto.news.UpdateNewsArticleStatusRequest;
import com.trotot.backend.entity.NewsArticleStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.NewsArticleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/news")
public class AdminNewsArticleController {

    private final NewsArticleService newsArticleService;

    public AdminNewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public PageResponse<NewsArticleResponse> getNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) NewsArticleStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return newsArticleService.searchAdminNews(keyword, category, status, page, size);
    }

    @GetMapping("/{articleId}")
    public NewsArticleResponse getNewsDetail(@PathVariable Long articleId) {
        return newsArticleService.getAdminArticle(articleId);
    }

    @PostMapping
    public ResponseEntity<NewsArticleResponse> createNews(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrUpdateNewsArticleRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newsArticleService.createArticle(request, principal.getId()));
    }

    @PutMapping("/{articleId}")
    public NewsArticleResponse updateNews(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long articleId,
            @Valid @RequestBody CreateOrUpdateNewsArticleRequest request) {
        return newsArticleService.updateArticle(articleId, request, principal.getId());
    }

    @PatchMapping("/{articleId}/status")
    public NewsArticleResponse updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long articleId,
            @Valid @RequestBody UpdateNewsArticleStatusRequest request) {
        return newsArticleService.updateStatus(articleId, request, principal.getId());
    }

    @DeleteMapping("/{articleId}")
    public MessageResponse deleteNews(@PathVariable Long articleId) {
        newsArticleService.deleteArticle(articleId);
        return new MessageResponse("Đã xóa tin tức thành công.");
    }
}
