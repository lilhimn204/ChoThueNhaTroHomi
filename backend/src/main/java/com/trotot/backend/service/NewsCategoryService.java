package com.trotot.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.news.NewsCategoryRequest;
import com.trotot.backend.dto.news.NewsCategoryResponse;
import com.trotot.backend.entity.NewsCategory;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.NewsArticleRepository;
import com.trotot.backend.repository.NewsCategoryRepository;
import com.trotot.backend.util.InputSanitizer;
import com.trotot.backend.util.SlugUtils;

@SuppressWarnings("null")
@Service
public class NewsCategoryService {

    private final NewsCategoryRepository newsCategoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public NewsCategoryService(
            NewsCategoryRepository newsCategoryRepository,
            NewsArticleRepository newsArticleRepository) {
        this.newsCategoryRepository = newsCategoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Transactional(readOnly = true)
    public List<NewsCategoryResponse> getPublicCategories() {
        return newsCategoryRepository.findByEnabledTrueOrderByDisplayOrderAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NewsCategoryResponse> getAdminCategories() {
        return newsCategoryRepository.findAllByOrderByDisplayOrderAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NewsCategoryResponse createCategory(NewsCategoryRequest request) {
        NewsCategory category = new NewsCategory();
        applyRequest(category, request, null);
        return toResponse(newsCategoryRepository.save(category));
    }

    @Transactional
    public NewsCategoryResponse updateCategory(Long categoryId, NewsCategoryRequest request) {
        NewsCategory category = getRequiredCategory(categoryId);
        String previousName = category.getName();
        applyRequest(category, request, categoryId);
        NewsCategory savedCategory = newsCategoryRepository.save(category);

        if (!previousName.equalsIgnoreCase(savedCategory.getName())) {
            newsArticleRepository.updateCategoryName(previousName, savedCategory.getName());
        }

        return toResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        NewsCategory category = getRequiredCategory(categoryId);

        if (newsArticleRepository.existsByCategoryIgnoreCase(category.getName())) {
            throw new BusinessException("Danh mục đang được sử dụng, hãy đổi danh mục bài viết trước khi xóa.");
        }

        newsCategoryRepository.delete(category);
    }

    public boolean categoryExists(String name) {
        return newsCategoryRepository.existsByNameIgnoreCase(name);
    }

    private void applyRequest(NewsCategory category, NewsCategoryRequest request, Long currentCategoryId) {
        String name = InputSanitizer.sanitizeRequired(request.name());

        if (currentCategoryId == null
                ? newsCategoryRepository.existsByNameIgnoreCase(name)
                : newsCategoryRepository.existsByNameIgnoreCaseAndIdNot(name, currentCategoryId)) {
            throw new BusinessException("Tên danh mục tin tức đã tồn tại.");
        }

        category.setName(name);
        category.setSlug(generateUniqueSlug(name, currentCategoryId));
        category.setDescription(InputSanitizer.sanitize(request.description()));
        category.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        category.setEnabled(request.enabled() == null || request.enabled());
    }

    private String generateUniqueSlug(String name, Long currentCategoryId) {
        String baseSlug = SlugUtils.toSlug(name);

        if ("room".equals(baseSlug)) {
            baseSlug = "tin-tuc";
        }

        String slug = baseSlug;
        int suffix = 2;

        while (currentCategoryId == null
                ? newsCategoryRepository.existsBySlug(slug)
                : newsCategoryRepository.existsBySlugAndIdNot(slug, currentCategoryId)) {
            slug = baseSlug + "-" + suffix;
            suffix += 1;
        }

        return slug;
    }

    private NewsCategory getRequiredCategory(Long categoryId) {
        return newsCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục tin tức với id = " + categoryId));
    }

    private NewsCategoryResponse toResponse(NewsCategory category) {
        return new NewsCategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getDisplayOrder(),
                category.isEnabled(),
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}
