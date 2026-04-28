package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.report.CreateRoomReportRequest;
import com.trotot.backend.dto.report.RoomReportResponse;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.RoomReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/room-reports")
public class RoomReportController {

    private final RoomReportService roomReportService;

    public RoomReportController(RoomReportService roomReportService) {
        this.roomReportService = roomReportService;
    }

    @PostMapping
    public ResponseEntity<RoomReportResponse> createReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateRoomReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomReportService.createReport(principal, request));
    }
}
