package com.trotot.backend.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.room.SavedRoomResponse;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.SavedRoom;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.SavedRoomRepository;
import com.trotot.backend.security.UserPrincipal;

import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("null")
@Slf4j
@Service
public class SavedRoomService {

    private final SavedRoomRepository savedRoomRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;

    public SavedRoomService(
            SavedRoomRepository savedRoomRepository,
            RoomRepository roomRepository,
            UserService userService) {
        this.savedRoomRepository = savedRoomRepository;
        this.roomRepository = roomRepository;
        this.userService = userService;
    }

    /**
     * Toggle a room as saved/unsaved. Returns true if saved, false if removed.
     */
    @Transactional
    public boolean toggleSave(UserPrincipal principal, Long roomId) {
        var existing = savedRoomRepository.findByUserIdAndRoomId(principal.getId(), roomId);

        if (existing.isPresent()) {
            savedRoomRepository.delete(existing.get());
            log.info("Room unsaved: userId={}, roomId={}", principal.getId(), roomId);
            return false;
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + roomId));
        User user = userService.getRequiredUserEntity(principal.getId());

        SavedRoom savedRoom = new SavedRoom();
        savedRoom.setUser(user);
        savedRoom.setRoom(room);
        savedRoomRepository.save(savedRoom);

        log.info("Room saved: userId={}, roomId={}", principal.getId(), roomId);
        return true;
    }

    /**
     * Check if a specific room is saved by the current user.
     */
    @Transactional(readOnly = true)
    public boolean isSaved(UserPrincipal principal, Long roomId) {
        return savedRoomRepository.existsByUserIdAndRoomId(principal.getId(), roomId);
    }

    /**
     * Batch check which rooms (by ID list) are saved by the current user.
     * Returns the list of saved room IDs.
     */
    @Transactional(readOnly = true)
    public List<Long> getSavedRoomIds(UserPrincipal principal, List<Long> roomIds) {
        if (roomIds == null || roomIds.isEmpty()) {
            return List.of();
        }

        return savedRoomRepository.findSavedRoomIdsByUserIdAndRoomIds(principal.getId(), roomIds);
    }

    /**
     * Get paginated list of rooms saved by the current user.
     */
    @Transactional(readOnly = true)
    public PageResponse<SavedRoomResponse> getMySavedRooms(UserPrincipal principal, int page, int size) {
        var pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        var savedRooms = savedRoomRepository.findByUserIdWithRoom(principal.getId(), pageable);
        return PageResponse.from(savedRooms, this::toSavedRoomResponse);
    }

    private SavedRoomResponse toSavedRoomResponse(SavedRoom savedRoom) {
        Room room = savedRoom.getRoom();
        return new SavedRoomResponse(
                room.getId(),
                resolveListingCode(room),
                room.getTitle(),
                room.getSlug(),
                room.getDistrict().getName(),
                room.getAddress(),
                room.getPrice(),
                room.getArea(),
                room.getStatus(),
                room.getThumbnail(),
                room.getCreatedAt(),
                savedRoom.getCreatedAt());
    }

    private String resolveListingCode(Room room) {
        if (room.getListingCode() != null && !room.getListingCode().isBlank()) {
            return room.getListingCode();
        }

        long id = room.getId() == null ? 0 : room.getId();
        return String.valueOf(10_000 + Math.floorMod(id * 7919, 90_000));
    }
}
