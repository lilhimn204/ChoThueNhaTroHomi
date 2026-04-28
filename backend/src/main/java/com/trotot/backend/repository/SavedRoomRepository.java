package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.trotot.backend.entity.SavedRoom;

public interface SavedRoomRepository extends JpaRepository<SavedRoom, Long> {

    boolean existsByUserIdAndRoomId(Long userId, Long roomId);

    Optional<SavedRoom> findByUserIdAndRoomId(Long userId, Long roomId);

    @Query("SELECT sr FROM SavedRoom sr JOIN FETCH sr.room r JOIN FETCH r.district WHERE sr.user.id = :userId ORDER BY sr.createdAt DESC")
    Page<SavedRoom> findByUserIdWithRoom(Long userId, Pageable pageable);

    @Query("SELECT sr.room.id FROM SavedRoom sr WHERE sr.user.id = :userId AND sr.room.id IN :roomIds")
    List<Long> findSavedRoomIdsByUserIdAndRoomIds(Long userId, List<Long> roomIds);

    long countByUserId(Long userId);

    void deleteByRoomId(Long roomId);
}
