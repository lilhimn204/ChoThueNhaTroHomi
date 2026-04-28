package com.trotot.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.MessageResponse;
import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.notification.NotificationResponse;
import com.trotot.backend.dto.notification.UnreadCountResponse;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public PageResponse<NotificationResponse> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return notificationService.getMyNotifications(principal.getId(), unreadOnly, page, size);
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return notificationService.getUnreadCount(principal.getId());
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return notificationService.markAsRead(id, principal.getId());
    }

    @PatchMapping("/read-all")
    public MessageResponse markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return new MessageResponse("Đã đánh dấu tất cả thông báo là đã đọc.");
    }
}
