package com.trotot.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.dashboard.DashboardChartResponse;
import com.trotot.backend.dto.dashboard.DashboardSummaryResponse;
import com.trotot.backend.service.AdminDashboardService;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    public DashboardSummaryResponse getDashboard() {
        return adminDashboardService.getDashboardSummary();
    }

    @GetMapping("/charts")
    public DashboardChartResponse getCharts() {
        return adminDashboardService.getDashboardCharts();
    }
}
