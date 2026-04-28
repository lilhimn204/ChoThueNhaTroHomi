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
import com.trotot.backend.dto.contact.AdminContactRequestResponse;
import com.trotot.backend.dto.contact.UpdateContactRequestStatusRequest;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.ContactRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/contact-requests")
public class AdminContactRequestController {

    private final ContactRequestService contactRequestService;

    public AdminContactRequestController(ContactRequestService contactRequestService) {
        this.contactRequestService = contactRequestService;
    }

    @GetMapping
    public PageResponse<AdminContactRequestResponse> getRequests(
            @RequestParam(required = false) ContactRequestStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return contactRequestService.searchAdminRequests(status, keyword, page, size);
    }

    @PatchMapping("/{requestId}/status")
    public AdminContactRequestResponse updateStatus(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateContactRequestStatusRequest request) {
        return contactRequestService.updateRequestStatus(requestId, request, principal.getId());
    }
}
