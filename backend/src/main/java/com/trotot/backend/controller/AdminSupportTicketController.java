package com.trotot.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.support.SupportTicketResponse;
import com.trotot.backend.dto.support.UpdateSupportTicketStatusRequest;
import com.trotot.backend.entity.SupportTicketStatus;
import com.trotot.backend.entity.SupportTicketType;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.SupportTicketService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/support-tickets")
public class AdminSupportTicketController {

    private final SupportTicketService supportTicketService;

    public AdminSupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping
    public PageResponse<SupportTicketResponse> getTickets(
            @RequestParam(required = false) SupportTicketType type,
            @RequestParam(required = false) SupportTicketStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return supportTicketService.searchAdminTickets(type, status, keyword, page, size);
    }

    @PatchMapping("/{ticketId}/status")
    public SupportTicketResponse updateStatus(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateSupportTicketStatusRequest request) {
        return supportTicketService.updateStatus(ticketId, request, principal.getId());
    }
}
