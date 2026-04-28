package com.trotot.backend.dto.report;

import java.time.Instant;

import com.trotot.backend.entity.RoomReportReason;
import com.trotot.backend.entity.RoomReportStatus;

public record RoomReportResponse(
        Long id,
        Long roomId,
        String roomTitle,
        String roomSlug,
        Long reporterId,
        String reporterName,
        String reporterEmail,
        RoomReportReason reason,
        String details,
        RoomReportStatus status,
        String adminNote,
        String handledByName,
        Instant handledAt,
        Instant createdAt) {
}
