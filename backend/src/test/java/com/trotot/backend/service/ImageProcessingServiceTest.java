package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("ImageProcessingService - optimized image output")
class ImageProcessingServiceTest {

    private final ImageProcessingService imageProcessingService = new ImageProcessingService();

    @Test
    @DisplayName("compressImage converts transparent PNG to readable JPEG without alpha")
    void compressImage_transparentPng_outputsJpegWithoutAlpha() throws Exception {
        BufferedImage source = new BufferedImage(32, 32, BufferedImage.TYPE_INT_ARGB);
        source.setRGB(0, 0, new Color(255, 0, 0, 0).getRGB());
        source.setRGB(1, 1, Color.BLUE.getRGB());

        byte[] compressed = imageProcessingService.compressImage(toImageBytes(source, "png"));
        BufferedImage output = ImageIO.read(new ByteArrayInputStream(compressed));

        assertNotNull(output);
        assertFalse(output.getColorModel().hasAlpha());
    }

    @Test
    @DisplayName("generateThumbnail keeps dimensions inside listing bounds")
    void generateThumbnail_largeImage_fitsBounds() throws Exception {
        BufferedImage source = new BufferedImage(1200, 800, BufferedImage.TYPE_INT_RGB);

        byte[] thumbnailBytes = imageProcessingService.generateThumbnail(toImageBytes(source, "jpg"));
        BufferedImage thumbnail = ImageIO.read(new ByteArrayInputStream(thumbnailBytes));

        assertNotNull(thumbnail);
        assertTrue(thumbnail.getWidth() <= 480);
        assertTrue(thumbnail.getHeight() <= 360);
    }

    @Test
    @DisplayName("WEBP ImageIO reader is available on the backend classpath")
    void webpReader_isRegistered() {
        assertTrue(ImageIO.getImageReadersByFormatName("webp").hasNext());
    }

    private byte[] toImageBytes(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, format, outputStream);
        return outputStream.toByteArray();
    }
}
