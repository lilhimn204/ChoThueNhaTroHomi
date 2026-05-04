package com.trotot.backend.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.util.InputSanitizer;
import com.trotot.backend.dto.notification.NotificationResponse;
import com.trotot.backend.dto.notification.UnreadCountResponse;
import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.Notification;
import com.trotot.backend.entity.NotificationType;
import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.SupportTicket;
import com.trotot.backend.entity.SupportTicketType;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.NotificationRepository;
import com.trotot.backend.repository.UserRepository;

@SuppressWarnings("null")
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailNotificationService emailNotificationService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               EmailNotificationService emailNotificationService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailNotificationService = emailNotificationService;
    }

    /**
     * Create notifications for a new contact request:
     * 1. Notify the host (room creator)
     * 2. Notify all admins
     */
    @Transactional
    public void createNotificationsForContactRequest(ContactRequest contactRequest, Room room) {
        String requesterName = contactRequest.getFullName();
        String roomTitle = room.getTitle();
        String title = "Yêu cầu liên hệ mới";
        String message = requesterName + " quan tâm phòng \"" + roomTitle + "\"";

        // Notify the host (room creator)
        User host = room.getCreatedBy();
        if (host != null) {
            createNotification(host, NotificationType.NEW_CONTACT_REQUEST, title, message, "/host/customers");
            emailNotificationService.sendContactRequestNotification(host, contactRequest, room);
        }

        // Notify all admins
        List<User> admins = userRepository.findDistinctByRoleName(RoleName.ADMIN).stream()
                .filter(user -> host == null || !user.getId().equals(host.getId()))
                .toList();

        for (User admin : admins) {
            createNotification(admin, NotificationType.NEW_CONTACT_REQUEST, title, message, "/admin/contact-requests");
            emailNotificationService.sendContactRequestNotification(admin, contactRequest, room);
        }

        log.info("Created notifications for contact request #{} (host={}, admins={})",
                contactRequest.getId(),
                host != null ? host.getId() : "none",
                admins.size());
    }

    /**
     * Create admin notifications for a new support ticket.
     * These tickets belong to the "Hỗ trợ Homi" admin area, including generic
     * wrong-listing reports submitted from /support/bao-cao-tin-sai.
     */
    @Transactional
    public void createNotificationsForSupportTicket(SupportTicket ticket) {
        String title = ticket.getType() == SupportTicketType.ROOM_REPORT
                ? "Báo cáo tin sai mới"
                : "Liên hệ Homi mới";
        String targetUrl = ticket.getType() == SupportTicketType.ROOM_REPORT
                ? "/admin/support-tickets?type=ROOM_REPORT&status=NEW"
                : "/admin/support-tickets?type=CONTACT&status=NEW";
        String sender = firstPresent(ticket.getFullName(), ticket.getEmail(), ticket.getPhone(), "Người dùng");
        String reference = ticket.getType() == SupportTicketType.ROOM_REPORT && ticket.getListingReference() != null
                ? " (" + ticket.getListingReference() + ")"
                : "";
        String message = truncate(sender + " đã gửi " + ticket.getSubject() + reference, 500);

        List<User> admins = userRepository.findDistinctByRoleName(RoleName.ADMIN);

        for (User admin : admins) {
            createNotification(admin, NotificationType.NEW_SUPPORT_TICKET, title, message, targetUrl);
        }

        log.info("Created notifications for support ticket #{} (admins={})",
                ticket.getId(),
                admins.size());
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(Long userId) {
        return new UnreadCountResponse(notificationRepository.countByRecipientIdAndReadFalse(userId));
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getMyNotifications(Long userId, boolean unreadOnly, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));

        var notifications = unreadOnly
                ? notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId, pageable)
                : notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);

        return PageResponse.from(notifications, this::toResponse);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông báo với id = " + notificationId));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResourceNotFoundException("Không tìm thấy thông báo với id = " + notificationId);
        }

        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
    }

    private void createNotification(User recipient, NotificationType type, String title, String message, String targetUrl) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetUrl(targetUrl);
        notificationRepository.save(notification);
    }

    private String firstPresent(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }

        return "";
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }

        return value.substring(0, maxLength - 3) + "...";
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getTargetUrl(),
                notification.isRead(),
                notification.getCreatedAt());
    }

}
