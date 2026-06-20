package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.contact.ContactRequestResponse;
import com.trotot.backend.dto.contact.CreateContactRequestRequest;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.ContactRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/contact-requests")
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    public ContactRequestController(ContactRequestService contactRequestService) {
        this.contactRequestService = contactRequestService;
    }

    @PostMapping
    public ResponseEntity<ContactRequestResponse> createRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateContactRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactRequestService.createContactRequest(principal, request));
    }

    @GetMapping("/me")
    public PageResponse<ContactRequestResponse> getMyRequests(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return contactRequestService.getMyRequests(principal, page, size);
    }

    @PatchMapping("/{requestId}/cancel")
    public ContactRequestResponse cancelMyRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long requestId) {
        return contactRequestService.cancelMyRequest(principal, requestId);
    }
}
