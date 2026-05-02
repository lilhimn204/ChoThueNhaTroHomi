package com.trotot.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.dto.upload.UploadResponse;
import com.trotot.backend.exception.BusinessException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileStorageService {

    private final AppProperties appProperties;
    private final ImageProcessingService imageProcessingService;

    public FileStorageService(AppProperties appProperties, ImageProcessingService imageProcessingService) {
        this.appProperties = appProperties;
        this.imageProcessingService = imageProcessingService;
    }

    public UploadResponse storeRoomImage(MultipartFile file, String requestBaseUrl) {
        return storeImage(file, "rooms", requestBaseUrl, true);
    }

    public UploadResponse storeAvatarImage(MultipartFile file, String requestBaseUrl) {
        return storeImage(file, "avatars", requestBaseUrl, false);
    }

    public UploadResponse storeNewsImage(MultipartFile file, String requestBaseUrl) {
        return storeImage(file, "news", requestBaseUrl, true);
    }

    private UploadResponse storeImage(MultipartFile file, String folder, String requestBaseUrl, boolean generateThumb) {
        validateImage(file);

        String baseName = UUID.randomUUID().toString();
        Path uploadDirectory = Path.of(appProperties.getUpload().getDirectory(), folder)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(uploadDirectory);

            // Compress and save optimized image
            byte[] originalBytes = file.getBytes();
            byte[] compressedBytes = imageProcessingService.compressImage(originalBytes);

            String fileName = baseName + ".jpg";
            Path targetFile = uploadDirectory.resolve(fileName).normalize();
            Files.write(targetFile, compressedBytes);

            long savedBytes = originalBytes.length - compressedBytes.length;
            long savedPercent = originalBytes.length > 0
                    ? (savedBytes * 100) / originalBytes.length
                    : 0;

            log.info("Image optimized: {} — original={}KB, compressed={}KB, saved={}%",
                    fileName,
                    originalBytes.length / 1024,
                    compressedBytes.length / 1024,
                    savedPercent);

            // Generate thumbnail for room images
            if (generateThumb) {
                byte[] thumbBytes = imageProcessingService.generateThumbnail(originalBytes);
                String thumbName = baseName + "_thumb.jpg";
                Path thumbFile = uploadDirectory.resolve(thumbName).normalize();
                Files.write(thumbFile, thumbBytes);

                log.debug("Thumbnail saved: {} ({}KB)", thumbName, thumbBytes.length / 1024);
            }

            String publicPath = "/uploads/" + folder + "/" + fileName;
            return new UploadResponse(fileName, buildPublicUrl(publicPath, requestBaseUrl), "image/jpeg", compressedBytes.length);

        } catch (IOException exception) {
            log.error("Failed to store image: {}", exception.getMessage());
            throw new BusinessException("Không thể lưu ảnh. Vui lòng thử lại.");
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Vui lòng chọn một file ảnh.");
        }

        long maxBytes = appProperties.getUpload().getMaxFileSizeMb() * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new BusinessException("Ảnh không được vượt quá " + appProperties.getUpload().getMaxFileSizeMb() + "MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()
                || !appProperties.getUpload().getAllowedContentTypes().contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BusinessException("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        }
    }

    private String buildPublicUrl(String publicPath, String requestBaseUrl) {
        String configuredBaseUrl = appProperties.getUpload().getPublicBaseUrl();
        String baseUrl = StringUtils.hasText(configuredBaseUrl) ? configuredBaseUrl : requestBaseUrl;

        return baseUrl.replaceAll("/+$", "") + publicPath;
    }
}
