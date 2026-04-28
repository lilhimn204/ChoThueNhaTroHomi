package com.trotot.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.trotot.backend.dto.upload.UploadResponse;
import com.trotot.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/rooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse uploadRoomImage(@RequestPart("file") MultipartFile file) {
        String requestBaseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .build()
                .toUriString();

        return fileStorageService.storeRoomImage(file, requestBaseUrl);
    }

    @PostMapping(value = "/avatars", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse uploadAvatarImage(@RequestPart("file") MultipartFile file) {
        String requestBaseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .build()
                .toUriString();

        return fileStorageService.storeAvatarImage(file, requestBaseUrl);
    }
}
