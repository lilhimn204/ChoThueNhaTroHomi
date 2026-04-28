package com.trotot.backend.dto.common;

public record FieldValidationError(
        String field,
        String message) {
}
