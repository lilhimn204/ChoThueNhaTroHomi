package com.trotot.backend.dto.notification;

import java.time.Instant;

import com.trotot.backend.entity.NotificationType;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String title,
        String message,
        String targetUrl,
        boolean read,
        Instant createdAt) {
}
