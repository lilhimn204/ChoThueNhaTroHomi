package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.MessageResponse;
import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.host.HostContactRequestResponse;
import com.trotot.backend.dto.host.HostDashboardResponse;
import com.trotot.backend.dto.host.HostProfileResponse;
import com.trotot.backend.dto.host.HostRoomListItemResponse;
import com.trotot.backend.dto.host.HostRoomResponse;
import com.trotot.backend.dto.host.UpdateHostContactRequestStatusRequest;
import com.trotot.backend.dto.host.UpdateHostProfileRequest;
import com.trotot.backend.dto.room.CreateOrUpdateRoomRequest;
import com.trotot.backend.dto.room.UpdateRoomStatusRequest;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.HostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/host")
public class HostController {

    private final HostService hostService;

    public HostController(HostService hostService) {
        this.hostService = hostService;
    }

    @GetMapping("/dashboard")
    public HostDashboardResponse getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return hostService.getDashboard(principal);
    }

    @GetMapping("/rooms")
    public PageResponse<HostRoomListItemResponse> getMyRooms(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return hostService.getMyRooms(principal, keyword, status, page, size);
    }

    @GetMapping("/rooms/{roomId}")
    public HostRoomResponse getMyRoomDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId) {
        return hostService.getMyRoomDetail(principal, roomId);
    }

    @PostMapping("/rooms")
    public ResponseEntity<HostRoomResponse> createMyRoom(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrUpdateRoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hostService.createMyRoom(principal, request));
    }

    @PutMapping("/rooms/{roomId}")
    public HostRoomResponse updateMyRoom(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId,
            @Valid @RequestBody CreateOrUpdateRoomRequest request) {
        return hostService.updateMyRoom(principal, roomId, request);
    }

    @PatchMapping("/rooms/{roomId}/status")
    public HostRoomResponse updateMyRoomStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId,
            @Valid @RequestBody UpdateRoomStatusRequest request) {
        return hostService.updateMyRoomStatus(principal, roomId, request);
    }

    @DeleteMapping("/rooms/{roomId}")
    public MessageResponse deleteMyRoom(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId) {
        hostService.deleteMyRoom(principal, roomId);
        return new MessageResponse("Đã xóa bài đăng của bạn thành công.");
    }

    @GetMapping("/contact-requests")
    public PageResponse<HostContactRequestResponse> getMyContactRequests(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) ContactRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return hostService.getMyContactRequests(principal, status, page, size);
    }

    @PatchMapping("/contact-requests/{requestId}/status")
    public HostContactRequestResponse updateMyContactRequestStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long requestId,
            @Valid @RequestBody UpdateHostContactRequestStatusRequest request) {
        return hostService.updateMyContactRequestStatus(principal, requestId, request);
    }

    @GetMapping("/profile")
    public HostProfileResponse getHostProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return hostService.getHostProfile(principal);
    }

    @PutMapping("/profile")
    public HostProfileResponse updateHostProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateHostProfileRequest request) {
        return hostService.updateHostProfile(principal, request);
    }
}
