package com.trotot.backend.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("InputSanitizer — HTML stripping and whitespace normalization")
class InputSanitizerTest {

    @Test
    @DisplayName("sanitize returns null for null input")
    void sanitize_null_returnsNull() {
        assertNull(InputSanitizer.sanitize(null));
    }

    @Test
    @DisplayName("sanitize returns null for blank input")
    void sanitize_blank_returnsNull() {
        assertNull(InputSanitizer.sanitize("   "));
    }

    @Test
    @DisplayName("sanitize trims whitespace")
    void sanitize_trims() {
        assertEquals("hello world", InputSanitizer.sanitize("  hello world  "));
    }

    @Test
    @DisplayName("sanitize strips HTML tags")
    void sanitize_stripsHtml() {
        assertEquals("alert('xss')", InputSanitizer.sanitize("<script>alert('xss')</script>"));
    }

    @Test
    @DisplayName("sanitize strips nested HTML tags")
    void sanitize_stripsNestedHtml() {
        assertEquals("Hello bold World", InputSanitizer.sanitize("Hello <b>bold</b> World"));
    }

    @Test
    @DisplayName("sanitize collapses excessive spaces")
    void sanitize_collapsesSpaces() {
        assertEquals("a b c", InputSanitizer.sanitize("a    b     c"));
    }

    @Test
    @DisplayName("sanitize handles combined attack")
    void sanitize_combinedAttack() {
        String input = "   <img src=x onerror=alert(1)>   Normal text   <div>injected</div>   ";
        String result = InputSanitizer.sanitize(input);
        assertEquals("Normal text injected", result);
    }

    @Test
    @DisplayName("sanitizeMultiline preserves single line breaks")
    void sanitizeMultiline_preservesLineBreaks() {
        assertEquals("Line 1\nLine 2", InputSanitizer.sanitizeMultiline("Line 1\nLine 2"));
    }

    @Test
    @DisplayName("sanitizeMultiline collapses 3+ newlines to 2")
    void sanitizeMultiline_collapsesExcessiveNewlines() {
        assertEquals("A\n\nB", InputSanitizer.sanitizeMultiline("A\n\n\n\nB"));
    }

    @Test
    @DisplayName("sanitizeMultiline strips HTML in multiline text")
    void sanitizeMultiline_stripsHtmlInMultiline() {
        String input = "<p>Paragraph 1</p>\n<p>Paragraph 2</p>";
        assertEquals("Paragraph 1\nParagraph 2", InputSanitizer.sanitizeMultiline(input));
    }

    @Test
    @DisplayName("sanitizeRequired returns empty string for null")
    void sanitizeRequired_null_returnsEmpty() {
        assertEquals("", InputSanitizer.sanitizeRequired(null));
    }

    @Test
    @DisplayName("sanitizeRequired returns sanitized value")
    void sanitizeRequired_validInput_returnsSanitized() {
        assertEquals("clean text", InputSanitizer.sanitizeRequired("  <b>clean</b> text  "));
    }

    // --- trimToNull ---

    @Test
    @DisplayName("trimToNull returns null for null input")
    void trimToNull_null_returnsNull() {
        assertNull(InputSanitizer.trimToNull(null));
    }

    @Test
    @DisplayName("trimToNull returns null for blank input")
    void trimToNull_blank_returnsNull() {
        assertNull(InputSanitizer.trimToNull("   "));
    }

    @Test
    @DisplayName("trimToNull trims and returns non-blank input")
    void trimToNull_validInput_returnsTrimmed() {
        assertEquals("hello", InputSanitizer.trimToNull("  hello  "));
    }

    // --- normalizePageSize ---

    @Test
    @DisplayName("normalizePageSize clamps below 1 to 1")
    void normalizePageSize_belowMin_returnsOne() {
        assertEquals(1, InputSanitizer.normalizePageSize(0, 20));
        assertEquals(1, InputSanitizer.normalizePageSize(-5, 50));
    }

    @Test
    @DisplayName("normalizePageSize clamps above max to max")
    void normalizePageSize_aboveMax_returnsMax() {
        assertEquals(20, InputSanitizer.normalizePageSize(100, 20));
        assertEquals(50, InputSanitizer.normalizePageSize(999, 50));
    }

    @Test
    @DisplayName("normalizePageSize returns value within range as-is")
    void normalizePageSize_withinRange_returnsValue() {
        assertEquals(10, InputSanitizer.normalizePageSize(10, 20));
        assertEquals(1, InputSanitizer.normalizePageSize(1, 50));
    }
}
