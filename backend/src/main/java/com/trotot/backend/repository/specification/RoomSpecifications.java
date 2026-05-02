package com.trotot.backend.repository.specification;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.RoomType;

public final class RoomSpecifications {

    private RoomSpecifications() {
    }

    public static Specification<Room> publicSearch(
            String keyword,
            Long districtId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minArea,
            BigDecimal maxArea,
            RoomStatus status,
            RoomType roomType,
            List<Long> amenityIds) {
        return visibleToPublic()
                .and(hasKeyword(keyword))
                .and(hasDistrict(districtId))
                .and(hasMinPrice(minPrice))
                .and(hasMaxPrice(maxPrice))
                .and(hasMinArea(minArea))
                .and(hasMaxArea(maxArea))
                .and(hasStatus(status))
                .and(hasRoomType(roomType))
                .and(hasAllSelectedAmenities(amenityIds));
    }

    public static Specification<Room> adminSearch(String keyword, RoomStatus status, Long districtId) {
        return hasKeyword(keyword)
                .and(hasStatus(status))
                .and(hasDistrict(districtId));
    }

    public static Specification<Room> hostSearch(Long ownerId, String keyword, RoomStatus status) {
        return ownedBy(ownerId)
                .and(hasKeyword(keyword))
                .and(hasStatus(status));
    }

    private static Specification<Room> ownedBy(Long ownerId) {
        return (root, query, cb) -> cb.equal(root.get("createdBy").get("id"), ownerId);
    }

    private static Specification<Room> visibleToPublic() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), RoomStatus.HIDDEN);
    }

    private static Specification<Room> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String normalizedKeyword = keyword.trim().toLowerCase();
            String pattern = "%" + normalizedKeyword + "%";
            String listingCodePattern = "%" + normalizedKeyword.replace("#", "") + "%";
            return cb.or(
                    cb.like(root.get("listingCode"), listingCodePattern),
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("address")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern));
        };
    }

    private static Specification<Room> hasDistrict(Long districtId) {
        return (root, query, cb) -> districtId == null
                ? cb.conjunction()
                : cb.equal(root.get("district").get("id"), districtId);
    }

    private static Specification<Room> hasMinPrice(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private static Specification<Room> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    private static Specification<Room> hasMinArea(BigDecimal minArea) {
        return (root, query, cb) -> minArea == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("area"), minArea);
    }

    private static Specification<Room> hasMaxArea(BigDecimal maxArea) {
        return (root, query, cb) -> maxArea == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("area"), maxArea);
    }

    private static Specification<Room> hasStatus(RoomStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<Room> hasRoomType(RoomType roomType) {
        return (root, query, cb) -> roomType == null
                ? cb.conjunction()
                : cb.equal(root.get("roomType"), roomType);
    }

    private static Specification<Room> hasAllSelectedAmenities(List<Long> amenityIds) {
        return (root, query, cb) -> {
            if (amenityIds == null || amenityIds.isEmpty()) {
                return cb.conjunction();
            }

            List<Long> uniqueAmenityIds = amenityIds.stream()
                    .filter(id -> id != null)
                    .distinct()
                    .toList();

            if (uniqueAmenityIds.isEmpty()) {
                return cb.conjunction();
            }

            if (query == null) {
                return cb.conjunction();
            }

            query.distinct(true);
            var subquery = query.subquery(Long.class);
            var subRoot = subquery.from(Room.class);
            var amenityJoin = subRoot.join("amenities");

            subquery.select(cb.countDistinct(amenityJoin.get("id")));
            subquery.where(
                    cb.equal(subRoot.get("id"), root.get("id")),
                    amenityJoin.get("id").in(uniqueAmenityIds));

            return cb.equal(subquery, (long) uniqueAmenityIds.size());
        };
    }
}
