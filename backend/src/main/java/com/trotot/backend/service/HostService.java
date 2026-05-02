package com.trotot.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.host.HostContactRequestResponse;
import com.trotot.backend.dto.host.HostDashboardResponse;
import com.trotot.backend.dto.host.HostProfileResponse;
import com.trotot.backend.dto.host.HostRoomListItemResponse;
import com.trotot.backend.dto.host.HostRoomResponse;
import com.trotot.backend.dto.host.UpdateHostContactRequestStatusRequest;
import com.trotot.backend.dto.host.UpdateHostProfileRequest;
import com.trotot.backend.dto.room.AdminRoomResponse;
import com.trotot.backend.dto.room.CreateOrUpdateRoomRequest;
import com.trotot.backend.dto.room.UpdateRoomStatusRequest;
import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.repository.specification.RoomSpecifications;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Service
public class HostService {

    private final RoomRepository roomRepository;
    private final ContactRequestRepository contactRequestRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final UserService userService;

    public HostService(
            RoomRepository roomRepository,
            ContactRequestRepository contactRequestRepository,
            UserRepository userRepository,
            RoomService roomService,
            UserService userService) {
        this.roomRepository = roomRepository;
        this.contactRequestRepository = contactRequestRepository;
        this.userRepository = userRepository;
        this.roomService = roomService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public HostDashboardResponse getDashboard(UserPrincipal principal) {
        Long ownerId = principal.getId();
        User user = userService.getRequiredUserEntity(ownerId);
        long availablePosts = roomRepository.countByCreatedByIdAndStatus(ownerId, RoomStatus.AVAILABLE);
        long fullPosts = roomRepository.countByCreatedByIdAndStatus(ownerId, RoomStatus.FULL);
        long hiddenPosts = roomRepository.countByCreatedByIdAndStatus(ownerId, RoomStatus.HIDDEN);

        return new HostDashboardResponse(
                user.getId(),
                user.getFullName(),
                roomRepository.countByCreatedById(ownerId),
                availablePosts,
                fullPosts + hiddenPosts,
                hiddenPosts,
                contactRequestRepository.countByRoomCreatedById(ownerId),
                contactRequestRepository.findTop5ByRoomCreatedByIdOrderByCreatedAtDesc(ownerId)
                        .stream()
                        .map(this::toHostContactRequestResponse)
                        .toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<HostRoomListItemResponse> getMyRooms(
            UserPrincipal principal,
            String keyword,
            RoomStatus status,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        var rooms = roomRepository.findAll(
                RoomSpecifications.hostSearch(principal.getId(), InputSanitizer.trimToNull(keyword), status),
                pageable);

        List<Long> roomIds = rooms.getContent().stream().map(Room::getId).toList();
        Map<Long, Long> contactCounts = contactRequestRepository.countByRoomIds(roomIds).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        return PageResponse.from(rooms, room -> toHostRoomListItemResponse(room, contactCounts.getOrDefault(room.getId(), 0L)));
    }

    @Transactional(readOnly = true)
    public HostRoomResponse getMyRoomDetail(UserPrincipal principal, Long roomId) {
        ensureOwnedRoom(principal.getId(), roomId);
        return toHostRoomResponse(roomService.getAdminRoomDetail(roomId));
    }

    @Transactional
    public HostRoomResponse createMyRoom(UserPrincipal principal, CreateOrUpdateRoomRequest request) {
        AdminRoomResponse room = roomService.createRoom(sanitizeHostRoomRequest(request, false), principal.getId());
        return toHostRoomResponse(room);
    }

    @Transactional
    public HostRoomResponse updateMyRoom(UserPrincipal principal, Long roomId, CreateOrUpdateRoomRequest request) {
        Room ownedRoom = ensureOwnedRoom(principal.getId(), roomId);
        AdminRoomResponse room = roomService.updateRoom(roomId, sanitizeHostRoomRequest(request, ownedRoom.isFeatured()));
        return toHostRoomResponse(room);
    }

    @Transactional
    public HostRoomResponse updateMyRoomStatus(UserPrincipal principal, Long roomId, UpdateRoomStatusRequest request) {
        ensureOwnedRoom(principal.getId(), roomId);
        return toHostRoomResponse(roomService.updateRoomStatus(roomId, request));
    }

    @Transactional
    public void deleteMyRoom(UserPrincipal principal, Long roomId) {
        ensureOwnedRoom(principal.getId(), roomId);
        roomService.deleteRoom(roomId);
    }

    @Transactional(readOnly = true)
    public PageResponse<HostContactRequestResponse> getMyContactRequests(
            UserPrincipal principal,
            ContactRequestStatus status,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        var requests = status == null
                ? contactRequestRepository.findByRoomCreatedByIdOrderByCreatedAtDesc(principal.getId(), pageable)
                : contactRequestRepository.findByRoomCreatedByIdAndStatusOrderByCreatedAtDesc(principal.getId(), status, pageable);
        return PageResponse.from(requests, this::toHostContactRequestResponse);
    }

    @Transactional
    public HostContactRequestResponse updateMyContactRequestStatus(
            UserPrincipal principal,
            Long requestId,
            UpdateHostContactRequestStatusRequest request) {
        ContactRequest contactRequest = contactRequestRepository.findByIdAndRoomCreatedById(requestId, principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu liên hệ thuộc bài đăng của bạn với id = " + requestId));

        contactRequest.setStatus(request.status());
        contactRequest.setAdminNote(InputSanitizer.sanitize(request.note()));

        if (request.status() == ContactRequestStatus.PENDING) {
            contactRequest.setHandledBy(null);
            contactRequest.setHandledAt(null);
        } else {
            contactRequest.setHandledBy(userService.getRequiredUserEntity(principal.getId()));
            contactRequest.setHandledAt(Instant.now());
        }

        return toHostContactRequestResponse(contactRequestRepository.save(contactRequest));
    }

    @Transactional(readOnly = true)
    public HostProfileResponse getHostProfile(UserPrincipal principal) {
        return toHostProfileResponse(userService.getRequiredUserEntity(principal.getId()));
    }

    @Transactional
    public HostProfileResponse updateHostProfile(UserPrincipal principal, UpdateHostProfileRequest request) {
        User user = userService.getRequiredUserEntity(principal.getId());
        user.setFullName(InputSanitizer.sanitizeRequired(request.fullName()));
        user.setPhone(InputSanitizer.trimToNull(request.phone()));
        user.setAvatarUrl(InputSanitizer.trimToNull(request.avatarUrl()));
        user.setAddress(InputSanitizer.sanitize(request.address()));
        user.setHostBio(InputSanitizer.sanitizeMultiline(request.hostBio()));
        return toHostProfileResponse(userRepository.save(user));
    }

    private Room ensureOwnedRoom(Long ownerId, Long roomId) {
        return roomRepository.findDetailedByIdAndCreatedById(roomId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài đăng thuộc tài khoản của bạn với id = " + roomId));
    }

    private CreateOrUpdateRoomRequest sanitizeHostRoomRequest(CreateOrUpdateRoomRequest request, boolean featured) {
        return new CreateOrUpdateRoomRequest(
                request.title(),
                request.description(),
                request.address(),
                request.districtId(),
                request.price(),
                request.area(),
                request.contactName(),
                request.contactPhone(),
                request.roomType(),
                request.status(),
                request.thumbnail(),
                featured,
                request.amenityIds(),
                request.images());
    }

    private HostRoomListItemResponse toHostRoomListItemResponse(Room room, long contactCount) {
        return new HostRoomListItemResponse(
                room.getId(),
                resolveListingCode(room),
                room.getTitle(),
                room.getSlug(),
                room.getDistrict().getName(),
                room.getPrice(),
                room.getArea(),
                room.getRoomType(),
                room.getStatus(),
                room.getThumbnail(),
                contactCount,
                room.getCreatedAt(),
                room.getCreatedAt(),
                room.getUpdatedAt());
    }

    private HostRoomResponse toHostRoomResponse(AdminRoomResponse room) {
        return new HostRoomResponse(
                room.id(),
                room.listingCode(),
                room.title(),
                room.slug(),
                room.description(),
                room.address(),
                room.districtId(),
                room.districtName(),
                room.price(),
                room.area(),
                room.roomType(),
                room.contactName(),
                room.contactPhone(),
                room.status(),
                room.thumbnail(),
                room.amenities(),
                room.images(),
                room.postedAt(),
                room.createdAt(),
                room.updatedAt());
    }

    private HostContactRequestResponse toHostContactRequestResponse(ContactRequest request) {
        return new HostContactRequestResponse(
                request.getId(),
                request.getRoom().getId(),
                request.getRoom().getTitle(),
                request.getRoom().getSlug(),
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

    private String resolveListingCode(Room room) {
        if (room.getListingCode() != null && !room.getListingCode().isBlank()) {
            return room.getListingCode();
        }

        long id = room.getId() == null ? 0 : room.getId();
        return String.valueOf(10_000 + Math.floorMod(id * 7919, 90_000));
    }

    private HostProfileResponse toHostProfileResponse(User user) {
        return new HostProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getAddress(),
                user.getHostBio(),
                user.getCreatedAt());
    }

}
