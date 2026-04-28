package com.trotot.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.room.SavedRoomResponse;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.SavedRoomService;

@RestController
@RequestMapping("/api/v1/saved-rooms")
public class SavedRoomController {

    private final SavedRoomService savedRoomService;

    public SavedRoomController(SavedRoomService savedRoomService) {
        this.savedRoomService = savedRoomService;
    }

    /**
     * Toggle save/unsave a room. Returns {"saved": true/false}.
     */
    @PostMapping("/{roomId}")
    public ResponseEntity<Map<String, Boolean>> toggleSave(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId) {
        boolean saved = savedRoomService.toggleSave(principal, roomId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    /**
     * Check if a room is saved by the current user.
     */
    @GetMapping("/{roomId}/status")
    public ResponseEntity<Map<String, Boolean>> checkSaved(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long roomId) {
        boolean saved = savedRoomService.isSaved(principal, roomId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    /**
     * Batch check which room IDs are saved. Returns list of saved IDs.
     */
    @GetMapping("/batch")
    public ResponseEntity<List<Long>> batchCheck(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam List<Long> roomIds) {
        return ResponseEntity.ok(savedRoomService.getSavedRoomIds(principal, roomIds));
    }

    /**
     * Get paginated list of saved rooms.
     */
    @GetMapping
    public PageResponse<SavedRoomResponse> getMySavedRooms(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return savedRoomService.getMySavedRooms(principal, page, size);
    }
}
