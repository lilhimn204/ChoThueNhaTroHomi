package com.trotot.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.report.RoomReportResponse;
import com.trotot.backend.dto.report.UpdateRoomReportStatusRequest;
import com.trotot.backend.entity.RoomReportReason;
import com.trotot.backend.entity.RoomReportStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.RoomReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/room-reports")
public class AdminRoomReportController {

    private final RoomReportService roomReportService;

    public AdminRoomReportController(RoomReportService roomReportService) {
        this.roomReportService = roomReportService;
    }

    @GetMapping
    public PageResponse<RoomReportResponse> getReports(
            @RequestParam(required = false) RoomReportStatus status,
            @RequestParam(required = false) RoomReportReason reason,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return roomReportService.searchAdminReports(status, reason, keyword, page, size);
    }

    @PatchMapping("/{reportId}/status")
    public RoomReportResponse updateStatus(
            @PathVariable Long reportId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateRoomReportStatusRequest request) {
        return roomReportService.updateStatus(reportId, request, principal.getId());
    }
}
