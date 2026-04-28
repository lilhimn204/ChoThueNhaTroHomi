package com.trotot.backend.dto.host;

import java.time.Instant;

import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.ContactRequestType;

public record HostContactRequestResponse(
        Long id,
        Long roomId,
        String roomTitle,
        String roomSlug,
        String requesterName,
        String email,
        String phone,
        ContactRequestType requestType,
        String message,
        String preferredViewingTime,
        ContactRequestStatus status,
        String note,
        String handledByName,
        Instant handledAt,
        Instant createdAt) {
}
