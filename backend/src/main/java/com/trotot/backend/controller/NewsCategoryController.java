package com.trotot.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.news.NewsCategoryResponse;
import com.trotot.backend.service.NewsCategoryService;

@RestController
@RequestMapping("/api/v1/news-categories")
public class NewsCategoryController {

    private final NewsCategoryService newsCategoryService;

    public NewsCategoryController(NewsCategoryService newsCategoryService) {
        this.newsCategoryService = newsCategoryService;
    }

    @GetMapping
    public List<NewsCategoryResponse> getCategories() {
        return newsCategoryService.getPublicCategories();
    }
}
