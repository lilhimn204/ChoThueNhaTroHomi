package com.trotot.backend.service;

import java.time.Instant;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.contact.AdminContactRequestResponse;
import com.trotot.backend.dto.contact.ContactRequestResponse;
import com.trotot.backend.dto.contact.CreateContactRequestRequest;
import com.trotot.backend.dto.contact.UpdateContactRequestStatusRequest;
import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.ContactRequestType;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.specification.ContactRequestSpecifications;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Service
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public ContactRequestService(
            ContactRequestRepository contactRequestRepository,
            RoomRepository roomRepository,
            UserService userService,
            NotificationService notificationService) {
        this.contactRequestRepository = contactRequestRepository;
        this.roomRepository = roomRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ContactRequestResponse createContactRequest(UserPrincipal principal, CreateContactRequestRequest request) {
        User user = userService.getRequiredUserEntity(principal.getId());
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + request.roomId()));

        if (room.getStatus() == RoomStatus.HIDDEN) {
            throw new ResourceNotFoundException("Phòng trọ này hiện không còn hiển thị.");
        }

        if (room.getCreatedBy() != null && user.getId().equals(room.getCreatedBy().getId())) {
            throw new BusinessException("Bạn không thể gửi yêu cầu xem phòng cho bài đăng của chính mình.");
        }

        ContactRequest contactRequest = new ContactRequest();
        contactRequest.setRoom(room);
        contactRequest.setUser(user);
        contactRequest.setRequestType(request.requestType() == null ? ContactRequestType.VIEWING : request.requestType());
        contactRequest.setFullName(InputSanitizer.sanitizeRequired(request.fullName()));
        contactRequest.setEmail(InputSanitizer.sanitize(request.email()));
        contactRequest.setPhone(request.phone().trim());
        contactRequest.setMessage(InputSanitizer.sanitizeMultiline(request.message()));
        contactRequest.setPreferredViewingTime(InputSanitizer.sanitize(request.preferredViewingTime()));

        ContactRequest saved = contactRequestRepository.save(contactRequest);

        // Create in-app notifications for host + admins
        notificationService.createNotificationsForContactRequest(saved, room);

        return toContactRequestResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactRequestResponse> getMyRequests(UserPrincipal principal, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));
        var requests = contactRequestRepository.findByUserIdOrderByCreatedAtDesc(principal.getId(), pageable);
        return PageResponse.from(requests, this::toContactRequestResponse);
    }

    @Transactional
    public ContactRequestResponse cancelMyRequest(UserPrincipal principal, Long requestId) {
        ContactRequest contactRequest = contactRequestRepository.findByIdAndUserId(requestId, principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy yêu cầu liên hệ thuộc tài khoản của bạn với id = " + requestId));

        if (contactRequest.getStatus() == ContactRequestStatus.CANCELLED) {
            return toContactRequestResponse(contactRequest);
        }

        if (contactRequest.getStatus() == ContactRequestStatus.RESOLVED) {
            throw new BusinessException("Yêu cầu đã được xử lý và không thể hủy.");
        }

        contactRequest.setStatus(ContactRequestStatus.CANCELLED);
        return toContactRequestResponse(contactRequestRepository.save(contactRequest));
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminContactRequestResponse> searchAdminRequests(
            ContactRequestStatus status,
            String keyword,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));
        var requests = contactRequestRepository.findAll(ContactRequestSpecifications.adminSearch(status, InputSanitizer.trimToNull(keyword)), pageable);
        return PageResponse.from(requests, this::toAdminContactRequestResponse);
    }

    @Transactional
    public AdminContactRequestResponse updateRequestStatus(
            Long requestId,
            UpdateContactRequestStatusRequest request,
            Long adminUserId) {
        ContactRequest contactRequest = contactRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu liên hệ với id = " + requestId));
        User admin = userService.getRequiredUserEntity(adminUserId);

        contactRequest.setStatus(request.status());
        contactRequest.setAdminNote(InputSanitizer.trimToNull(request.adminNote()));
        contactRequest.setHandledBy(admin);
        contactRequest.setHandledAt(Instant.now());

        return toAdminContactRequestResponse(contactRequestRepository.save(contactRequest));
    }

    private ContactRequestResponse toContactRequestResponse(ContactRequest request) {
        return new ContactRequestResponse(
                request.getId(),
                request.getRoom().getId(),
                request.getRoom().getTitle(),
                request.getRoom().getSlug(),
                request.getRequestType(),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getMessage(),
                request.getPreferredViewingTime(),
                request.getStatus(),
                request.getAdminNote(),
                request.getHandledAt(),
                request.getCreatedAt());
    }

    private AdminContactRequestResponse toAdminContactRequestResponse(ContactRequest request) {
        return new AdminContactRequestResponse(
                request.getId(),
                request.getRoom().getId(),
                request.getRoom().getTitle(),
                request.getRoom().getSlug(),
                request.getUser() == null ? null : request.getUser().getId(),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getRequestType(),
                request.getMessage(),
                request.getPreferredViewingTime(),
                request.getStatus(),
                request.getAdminNote(),
                request.getHandledBy() == null ? null : request.getHandledBy().getFullName(),
                request.getHandledAt(),
                request.getCreatedAt());
    }

}
