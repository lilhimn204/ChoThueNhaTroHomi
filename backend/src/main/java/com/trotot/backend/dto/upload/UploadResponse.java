package com.trotot.backend.dto.upload;

public record UploadResponse(
        String fileName,
        String url,
        String contentType,
        long size) {
}
