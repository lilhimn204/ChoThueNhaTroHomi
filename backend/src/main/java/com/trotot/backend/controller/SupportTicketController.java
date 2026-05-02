package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.support.CreateSupportTicketRequest;
import com.trotot.backend.dto.support.SupportTicketResponse;
import com.trotot.backend.service.SupportTicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/support-tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @PostMapping
    public ResponseEntity<SupportTicketResponse> createTicket(
            @Valid @RequestBody CreateSupportTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supportTicketService.createTicket(request));
    }
}
