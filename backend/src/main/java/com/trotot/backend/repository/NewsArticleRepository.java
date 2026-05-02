package com.trotot.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trotot.backend.entity.NewsArticle;
import com.trotot.backend.entity.NewsArticleStatus;

public interface NewsArticleRepository
        extends JpaRepository<NewsArticle, Long>, JpaSpecificationExecutor<NewsArticle> {

    Optional<NewsArticle> findBySlugAndStatus(String slug, NewsArticleStatus status);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByCategoryIgnoreCase(String category);

    @Modifying
    @Query("update NewsArticle article set article.category = :newName where lower(article.category) = lower(:oldName)")
    int updateCategoryName(@Param("oldName") String oldName, @Param("newName") String newName);
}
