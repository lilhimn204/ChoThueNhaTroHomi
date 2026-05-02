package com.trotot.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.MessageResponse;
import com.trotot.backend.dto.news.NewsCategoryRequest;
import com.trotot.backend.dto.news.NewsCategoryResponse;
import com.trotot.backend.service.NewsCategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/news-categories")
public class AdminNewsCategoryController {

    private final NewsCategoryService newsCategoryService;

    public AdminNewsCategoryController(NewsCategoryService newsCategoryService) {
        this.newsCategoryService = newsCategoryService;
    }

    @GetMapping
    public List<NewsCategoryResponse> getCategories() {
        return newsCategoryService.getAdminCategories();
    }

    @PostMapping
    public ResponseEntity<NewsCategoryResponse> createCategory(
            @Valid @RequestBody NewsCategoryRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newsCategoryService.createCategory(request));
    }

    @PutMapping("/{categoryId}")
    public NewsCategoryResponse updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody NewsCategoryRequest request) {
        return newsCategoryService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public MessageResponse deleteCategory(@PathVariable Long categoryId) {
        newsCategoryService.deleteCategory(categoryId);
        return new MessageResponse("Đã xóa danh mục tin tức thành công.");
    }
}
