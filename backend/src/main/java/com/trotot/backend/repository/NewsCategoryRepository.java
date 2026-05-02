package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trotot.backend.entity.NewsCategory;

public interface NewsCategoryRepository extends JpaRepository<NewsCategory, Long> {

    List<NewsCategory> findByEnabledTrueOrderByDisplayOrderAscNameAsc();

    List<NewsCategory> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<NewsCategory> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
