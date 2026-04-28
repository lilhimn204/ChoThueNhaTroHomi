package com.trotot.backend.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/**
 * Compresses and resizes images before storage.
 *
 * <p>Converts all uploads to JPEG format with configurable quality and
 * maximum dimensions. This reduces storage usage and improves page load
 * speed without requiring external libraries.</p>
 */
@Slf4j
@Service
public class ImageProcessingService {

    private static final int MAX_WIDTH = 1920;
    private static final int MAX_HEIGHT = 1440;
    private static final int THUMB_WIDTH = 480;
    private static final int THUMB_HEIGHT = 360;
    private static final float QUALITY = 0.82f;
    private static final float THUMB_QUALITY = 0.75f;

    /**
     * Compress and resize an image, keeping aspect ratio within max bounds.
     *
     * @param inputStream original image data
     * @return compressed JPEG bytes
     */
    public byte[] compressImage(InputStream inputStream) throws IOException {
        BufferedImage original = readImage(inputStream);

        BufferedImage resized = resizeToFit(original, MAX_WIDTH, MAX_HEIGHT);
        byte[] result = writeJpeg(resized, QUALITY);

        log.debug("Image compressed: {}x{} -> {}x{}, size={}KB",
                original.getWidth(), original.getHeight(),
                resized.getWidth(), resized.getHeight(),
                result.length / 1024);

        return result;
    }

    /**
     * Generate a small thumbnail image for listing cards.
     *
     * @param inputStream original image data
     * @return compressed thumbnail JPEG bytes
     */
    public byte[] generateThumbnail(InputStream inputStream) throws IOException {
        BufferedImage original = readImage(inputStream);

        BufferedImage thumbnail = resizeToFit(original, THUMB_WIDTH, THUMB_HEIGHT);
        byte[] result = writeJpeg(thumbnail, THUMB_QUALITY);

        log.debug("Thumbnail generated: {}x{}, size={}KB",
                thumbnail.getWidth(), thumbnail.getHeight(),
                result.length / 1024);

        return result;
    }

    /**
     * Compress image bytes (convenience overload for re-reading already loaded data).
     */
    public byte[] compressImage(byte[] imageBytes) throws IOException {
        return compressImage(new ByteArrayInputStream(imageBytes));
    }

    /**
     * Generate thumbnail from image bytes.
     */
    public byte[] generateThumbnail(byte[] imageBytes) throws IOException {
        return generateThumbnail(new ByteArrayInputStream(imageBytes));
    }

    private BufferedImage readImage(InputStream inputStream) throws IOException {
        BufferedImage image = ImageIO.read(inputStream);

        if (image == null) {
            throw new IOException("Could not read image data.");
        }

        return image;
    }

    private BufferedImage resizeToFit(BufferedImage source, int maxW, int maxH) {
        int srcW = source.getWidth();
        int srcH = source.getHeight();

        if (srcW <= maxW && srcH <= maxH) {
            return source;
        }

        double scale = Math.min((double) maxW / srcW, (double) maxH / srcH);
        int targetW = (int) Math.round(srcW * scale);
        int targetH = (int) Math.round(srcH * scale);

        BufferedImage resized = new BufferedImage(targetW, targetH, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, targetW, targetH);
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.drawImage(source, 0, 0, targetW, targetH, null);
        g2d.dispose();

        return resized;
    }

    private byte[] writeJpeg(BufferedImage image, float quality) throws IOException {
        BufferedImage jpegImage = toJpegCompatibleImage(image);
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
        ImageWriteParam params = writer.getDefaultWriteParam();
        params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        params.setCompressionQuality(quality);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (var imageOutputStream = ImageIO.createImageOutputStream(outputStream)) {
            writer.setOutput(imageOutputStream);
            writer.write(null, new IIOImage(jpegImage, null, null), params);
        } finally {
            writer.dispose();
        }

        return outputStream.toByteArray();
    }

    private BufferedImage toJpegCompatibleImage(BufferedImage image) {
        if (image.getType() == BufferedImage.TYPE_INT_RGB && !image.getColorModel().hasAlpha()) {
            return image;
        }

        BufferedImage rgbImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = rgbImage.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, image.getWidth(), image.getHeight());
        g2d.drawImage(image, 0, 0, null);
        g2d.dispose();

        return rgbImage;
    }
}
