package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.ContactRequestStatus;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long>, JpaSpecificationExecutor<ContactRequest> {

    Page<ContactRequest> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"room", "user", "handledBy"})
    Page<ContactRequest> findByRoomCreatedByIdOrderByCreatedAtDesc(Long ownerId, Pageable pageable);

    @EntityGraph(attributePaths = {"room", "user", "handledBy"})
    Page<ContactRequest> findByRoomCreatedByIdAndStatusOrderByCreatedAtDesc(Long ownerId, ContactRequestStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"room", "user", "handledBy"})
    Optional<ContactRequest> findByIdAndRoomCreatedById(Long requestId, Long ownerId);

    long countByStatus(ContactRequestStatus status);

    long countByRoomId(Long roomId);

    void deleteByRoomId(Long roomId);

    @Query("SELECT cr.room.id, COUNT(cr) FROM ContactRequest cr WHERE cr.room.id IN :roomIds GROUP BY cr.room.id")
    List<Object[]> countByRoomIds(List<Long> roomIds);

    long countByRoomCreatedById(Long ownerId);

    List<ContactRequest> findTop5ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"room", "user", "handledBy"})
    List<ContactRequest> findTop5ByRoomCreatedByIdOrderByCreatedAtDesc(Long ownerId);

    @Query("SELECT c.status, COUNT(c) FROM ContactRequest c GROUP BY c.status")
    List<Object[]> countRequestsByStatus();
}
