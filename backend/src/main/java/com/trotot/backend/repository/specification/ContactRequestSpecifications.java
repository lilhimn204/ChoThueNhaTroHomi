package com.trotot.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.ContactRequestStatus;

import jakarta.persistence.criteria.JoinType;

public final class ContactRequestSpecifications {

    private ContactRequestSpecifications() {
    }

    public static Specification<ContactRequest> adminSearch(ContactRequestStatus status, String keyword) {
        return hasStatus(status).and(hasKeyword(keyword));
    }

    private static Specification<ContactRequest> hasStatus(ContactRequestStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<ContactRequest> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            var roomJoin = root.join("room", JoinType.LEFT);
            return cb.or(
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern),
                    cb.like(cb.lower(root.get("message")), pattern),
                    cb.like(cb.lower(roomJoin.get("title")), pattern));
        };
    }
}
