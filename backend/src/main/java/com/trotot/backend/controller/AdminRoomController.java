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
import com.trotot.backend.dto.room.AdminRoomListItemResponse;
import com.trotot.backend.dto.room.AdminRoomResponse;
import com.trotot.backend.dto.room.CreateOrUpdateRoomRequest;
import com.trotot.backend.dto.room.UpdateRoomStatusRequest;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.RoomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/rooms")
public class AdminRoomController {

    private final RoomService roomService;

    public AdminRoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public PageResponse<AdminRoomListItemResponse> getRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) Long districtId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return roomService.searchAdminRooms(keyword, status, districtId, page, size);
    }

    @GetMapping("/{roomId}")
    public AdminRoomResponse getRoomDetail(@PathVariable Long roomId) {
        return roomService.getAdminRoomDetail(roomId);
    }

    @PostMapping
    public ResponseEntity<AdminRoomResponse> createRoom(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrUpdateRoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(request, principal.getId()));
    }

    @PutMapping("/{roomId}")
    public AdminRoomResponse updateRoom(
            @PathVariable Long roomId,
            @Valid @RequestBody CreateOrUpdateRoomRequest request) {
        return roomService.updateRoom(roomId, request);
    }

    @PatchMapping("/{roomId}/status")
    public AdminRoomResponse updateStatus(
            @PathVariable Long roomId,
            @Valid @RequestBody UpdateRoomStatusRequest request) {
        return roomService.updateRoomStatus(roomId, request);
    }

    @DeleteMapping("/{roomId}")
    public MessageResponse deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return new MessageResponse("Đã xóa bài đăng phòng trọ thành công.");
    }
}
