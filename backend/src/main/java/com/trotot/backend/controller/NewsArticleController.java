package com.trotot.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.news.NewsArticleResponse;
import com.trotot.backend.service.NewsArticleService;

@RestController
@RequestMapping("/api/v1/news")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public PageResponse<NewsArticleResponse> getNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        return newsArticleService.searchPublicNews(keyword, category, page, size);
    }

    @GetMapping("/{slug}")
    public NewsArticleResponse getNewsDetail(@PathVariable String slug) {
        return newsArticleService.getPublicArticle(slug);
    }
}
