package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;

public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByListingCode(String listingCode);

    Optional<Room> findBySlugAndStatusNot(String slug, RoomStatus status);

    @EntityGraph(attributePaths = {"district", "amenities", "images"})
    Optional<Room> findDetailedById(Long id);

    @EntityGraph(attributePaths = {"district", "amenities", "images"})
    Optional<Room> findDetailedByIdAndCreatedById(Long id, Long createdById);

    @EntityGraph(attributePaths = {"district", "amenities", "images"})
    Optional<Room> findDetailedBySlugAndStatusNot(String slug, RoomStatus status);

    Page<Room> findByCreatedByIdOrderByCreatedAtDesc(Long createdById, Pageable pageable);

    List<Room> findTop6ByFeaturedTrueAndStatusOrderByCreatedAtDesc(RoomStatus status);

    long countByStatus(RoomStatus status);

    long countByStatusNot(RoomStatus status);

    long countByCreatedById(Long createdById);

    long countByCreatedByIdAndStatus(Long createdById, RoomStatus status);

    @Query("SELECT r.district.name, COUNT(r) FROM Room r GROUP BY r.district.name ORDER BY COUNT(r) DESC")
    List<Object[]> countRoomsByDistrict();

    @Query("SELECT r.status, COUNT(r) FROM Room r GROUP BY r.status")
    List<Object[]> countRoomsByStatus();
}
