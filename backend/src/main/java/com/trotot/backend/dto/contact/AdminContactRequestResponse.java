package com.trotot.backend.dto.contact;

import java.time.Instant;

import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.ContactRequestType;

public record AdminContactRequestResponse(
        Long id,
        Long roomId,
        String roomTitle,
        String roomSlug,
        Long userId,
        String requesterName,
        String email,
        String phone,
        ContactRequestType requestType,
        String message,
        String preferredViewingTime,
        ContactRequestStatus status,
        String adminNote,
        String handledByName,
        Instant handledAt,
        Instant createdAt) {
}
