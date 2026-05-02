package com.trotot.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.trotot.backend.entity.SupportTicket;
import com.trotot.backend.entity.SupportTicketStatus;
import com.trotot.backend.entity.SupportTicketType;

public final class SupportTicketSpecifications {

    private SupportTicketSpecifications() {
    }

    public static Specification<SupportTicket> adminSearch(
            SupportTicketType type,
            SupportTicketStatus status,
            String keyword) {
        return hasType(type)
                .and(hasStatus(status))
                .and(hasKeyword(keyword));
    }

    private static Specification<SupportTicket> hasType(SupportTicketType type) {
        return (root, query, cb) -> type == null
                ? cb.conjunction()
                : cb.equal(root.get("type"), type);
    }

    private static Specification<SupportTicket> hasStatus(SupportTicketStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<SupportTicket> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("listingReference")), pattern),
                    cb.like(cb.lower(root.get("reason")), pattern),
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern),
                    cb.like(cb.lower(root.get("subject")), pattern),
                    cb.like(cb.lower(root.get("message")), pattern));
        };
    }
}
