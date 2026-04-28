package com.trotot.backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.room.RoomDetailResponse;
import com.trotot.backend.dto.room.RoomStatsResponse;
import com.trotot.backend.dto.room.RoomSummaryResponse;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.service.RoomService;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public PageResponse<RoomSummaryResponse> getRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minArea,
            @RequestParam(required = false) BigDecimal maxArea,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) List<Long> amenityIds,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return roomService.searchPublicRooms(
                keyword,
                districtId,
                minPrice,
                maxPrice,
                minArea,
                maxArea,
                status,
                amenityIds,
                sort,
                page,
                size);
    }

    @GetMapping("/featured")
    public List<RoomSummaryResponse> getFeaturedRooms() {
        return roomService.getFeaturedRooms();
    }

    @GetMapping("/stats")
    public RoomStatsResponse getRoomStats() {
        return roomService.getPublicRoomStats();
    }

    @GetMapping("/{slug}")
    public RoomDetailResponse getRoomDetail(@PathVariable String slug) {
        return roomService.getPublicRoomDetail(slug);
    }
}
