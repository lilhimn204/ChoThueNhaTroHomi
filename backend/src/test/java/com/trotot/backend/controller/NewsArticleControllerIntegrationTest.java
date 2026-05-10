package com.trotot.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.trotot.backend.entity.NewsArticle;
import com.trotot.backend.entity.NewsArticleStatus;
import com.trotot.backend.repository.NewsArticleRepository;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
@ActiveProfiles("test")
@DisplayName("NewsArticleController - public news API")
class NewsArticleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @BeforeEach
    void setUp() {
        newsArticleRepository.deleteAll();
    }

    @Test
    @DisplayName("public news list only returns published articles")
    void getNews_onlyReturnsPublishedArticles() throws Exception {
        saveArticle("Kinh nghiệm thuê phòng an toàn", "kinh-nghiem-thue-phong-an-toan", NewsArticleStatus.PUBLISHED);
        saveArticle("Bản nháp nội bộ", "ban-nhap-noi-bo", NewsArticleStatus.DRAFT);

        mockMvc.perform(get("/api/v1/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].slug").value("kinh-nghiem-thue-phong-an-toan"));
    }

    @Test
    @DisplayName("draft article detail is hidden from public route")
    void getNewsDetail_draftArticle_returnsNotFound() throws Exception {
        saveArticle("Bản nháp nội bộ", "ban-nhap-noi-bo", NewsArticleStatus.DRAFT);

        mockMvc.perform(get("/api/v1/news/ban-nhap-noi-bo"))
                .andExpect(status().isNotFound());
    }

    private void saveArticle(String title, String slug, NewsArticleStatus status) {
        NewsArticle article = new NewsArticle();
        article.setTitle(title);
        article.setSlug(slug);
        article.setSummary("Tóm tắt bài viết phục vụ kiểm thử.");
        article.setContent("Nội dung bài viết phục vụ kiểm thử public news API.");
        article.setCategory("Hướng dẫn");
        article.setAuthorName("Homi");
        article.setStatus(status);
        article.setPublishedAt(status == NewsArticleStatus.PUBLISHED ? Instant.now() : null);

        newsArticleRepository.save(article);
    }
}
