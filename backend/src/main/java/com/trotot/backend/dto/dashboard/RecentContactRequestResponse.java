package com.trotot.backend.dto.dashboard;

import java.time.Instant;

import com.trotot.backend.entity.ContactRequestStatus;

public record RecentContactRequestResponse(
        Long id,
        String requesterName,
        String roomTitle,
        ContactRequestStatus status,
        Instant createdAt) {
}
