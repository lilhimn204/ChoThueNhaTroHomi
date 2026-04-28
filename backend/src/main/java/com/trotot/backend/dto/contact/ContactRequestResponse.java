package com.trotot.backend.dto.contact;

import java.time.Instant;

import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.ContactRequestType;

public record ContactRequestResponse(
        Long id,
        Long roomId,
        String roomTitle,
        String roomSlug,
        ContactRequestType requestType,
        String fullName,
        String email,
        String phone,
        String message,
        String preferredViewingTime,
        ContactRequestStatus status,
        String adminNote,
        Instant handledAt,
        Instant createdAt) {
}
