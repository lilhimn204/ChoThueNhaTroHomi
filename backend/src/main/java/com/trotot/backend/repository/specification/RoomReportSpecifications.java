package com.trotot.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.trotot.backend.entity.RoomReport;
import com.trotot.backend.entity.RoomReportReason;
import com.trotot.backend.entity.RoomReportStatus;

import jakarta.persistence.criteria.JoinType;

public final class RoomReportSpecifications {

    private RoomReportSpecifications() {
    }

    public static Specification<RoomReport> adminSearch(
            RoomReportStatus status,
            RoomReportReason reason,
            String keyword) {
        return hasStatus(status)
                .and(hasReason(reason))
                .and(hasKeyword(keyword));
    }

    private static Specification<RoomReport> hasStatus(RoomReportStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<RoomReport> hasReason(RoomReportReason reason) {
        return (root, query, cb) -> reason == null
                ? cb.conjunction()
                : cb.equal(root.get("reason"), reason);
    }

    private static Specification<RoomReport> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            var roomJoin = root.join("room", JoinType.LEFT);
            var reporterJoin = root.join("reporter", JoinType.LEFT);

            return cb.or(
                    cb.like(cb.lower(roomJoin.get("title")), pattern),
                    cb.like(cb.lower(roomJoin.get("address")), pattern),
                    cb.like(cb.lower(reporterJoin.get("fullName")), pattern),
                    cb.like(cb.lower(reporterJoin.get("email")), pattern),
                    cb.like(cb.lower(root.get("details")), pattern));
        };
    }
}
