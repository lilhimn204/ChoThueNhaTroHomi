package com.trotot.backend.util;

import java.util.regex.Pattern;

/**
 * Centralized input sanitization utilities.
 *
 * <p>Provides methods to trim whitespace, strip HTML/script tags, and
 * normalize user-supplied text before persisting to the database.</p>
 *
 * <p>While React auto-escapes output (preventing XSS on the frontend),
 * sanitizing at the persistence layer ensures:</p>
 * <ul>
 *   <li>No HTML/script tags stored in the database</li>
 *   <li>Clean data for any future consumers (APIs, exports, emails)</li>
 *   <li>Defense-in-depth against injection attacks</li>
 * </ul>
 */
public final class InputSanitizer {

    /**
     * Matches HTML/XML tags including self-closing tags.
     */
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    /**
     * Matches consecutive whitespace (spaces, tabs, etc.) but preserves newlines.
     */
    private static final Pattern EXCESSIVE_SPACES = Pattern.compile("[ \\t]{2,}");

    /**
     * Matches consecutive blank lines (3+ newlines in a row → 2 newlines).
     */
    private static final Pattern EXCESSIVE_NEWLINES = Pattern.compile("\\n{3,}");

    private InputSanitizer() {
        // Utility class — no instantiation
    }

    /**
     * Sanitize a single-line text field: strip HTML tags, collapse whitespace, trim.
     *
     * @param value raw input
     * @return sanitized string, or null if input is null/blank
     */
    public static String sanitize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String cleaned = stripHtmlTags(value);
        cleaned = EXCESSIVE_SPACES.matcher(cleaned).replaceAll(" ");
        cleaned = cleaned.trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    /**
     * Sanitize a multi-line text field (e.g. room description, message).
     * Preserves intentional line breaks but strips HTML and collapses excessive spacing.
     *
     * @param value raw input
     * @return sanitized string, or null if input is null/blank
     */
    public static String sanitizeMultiline(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String cleaned = stripHtmlTags(value);
        cleaned = EXCESSIVE_SPACES.matcher(cleaned).replaceAll(" ");
        cleaned = EXCESSIVE_NEWLINES.matcher(cleaned).replaceAll("\n\n");
        cleaned = cleaned.trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    /**
     * Sanitize and return non-null result. Throws if result is blank.
     * Use for @NotBlank fields where null is not acceptable.
     *
     * @param value raw input
     * @return sanitized non-null string
     */
    public static String sanitizeRequired(String value) {
        String result = sanitize(value);
        return result == null ? "" : result;
    }

    /**
     * Sanitize a multi-line field and return non-null result.
     *
     * @param value raw input
     * @return sanitized non-null string
     */
    public static String sanitizeRequiredMultiline(String value) {
        String result = sanitizeMultiline(value);
        return result == null ? "" : result;
    }

    /**
     * Trim a string and return null if blank.
     * Useful for optional query/filter parameters.
     *
     * @param value raw input
     * @return trimmed string, or null if input is null/blank
     */
    public static String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    /**
     * Clamp a page size to a safe range [1, maxSize].
     *
     * @param size     requested page size
     * @param maxSize  upper bound
     * @return clamped page size
     */
    public static int normalizePageSize(int size, int maxSize) {
        return Math.min(Math.max(size, 1), maxSize);
    }

    /**
     * Remove all HTML/XML tags from the input.
     */
    private static String stripHtmlTags(String value) {
        return HTML_TAG_PATTERN.matcher(value).replaceAll("");
    }
}
