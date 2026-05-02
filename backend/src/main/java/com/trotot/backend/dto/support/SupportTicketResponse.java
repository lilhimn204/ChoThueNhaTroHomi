package com.trotot.backend.dto.support;

import java.time.Instant;

import com.trotot.backend.entity.SupportTicketStatus;
import com.trotot.backend.entity.SupportTicketType;

public record SupportTicketResponse(
        Long id,
        SupportTicketType type,
        String listingReference,
        String reason,
        String fullName,
        String email,
        String phone,
        String subject,
        String message,
        SupportTicketStatus status,
        String adminNote,
        String handledByName,
        Instant handledAt,
        Instant createdAt,
        Instant updatedAt) {
}
