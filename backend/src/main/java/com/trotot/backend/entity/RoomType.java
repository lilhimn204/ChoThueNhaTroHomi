package com.trotot.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoomType {
    APARTMENT("apartment", "Cho thuê căn hộ chung cư"),
    MINI_APARTMENT("mini-apartment", "Cho thuê chung cư mini, căn hộ dịch vụ"),
    PRIVATE_HOUSE("private-house", "Cho thuê nhà riêng"),
    BOARDING_ROOM("boarding-room", "Cho thuê nhà trọ, phòng trọ");

    private final String slug;
    private final String label;

    RoomType(String slug, String label) {
        this.slug = slug;
        this.label = label;
    }

    @JsonValue
    public String getSlug() {
        return slug;
    }

    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static RoomType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim();
        for (RoomType type : values()) {
            if (type.slug.equalsIgnoreCase(normalized) || type.name().equalsIgnoreCase(normalized)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Loai phong khong hop le: " + value);
    }
}
