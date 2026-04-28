package com.trotot.backend.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("SlugUtils — Vietnamese title to URL slug")
class SlugUtilsTest {

    @Test
    @DisplayName("Converts Vietnamese accented characters to ASCII slug")
    void toSlug_vietnameseTitle_producesAsciiSlug() {
        String input = "Phòng trọ Quận Cầu Giấy giá rẻ";
        String result = SlugUtils.toSlug(input);
        assertEquals("phong-tro-quan-cau-giay-gia-re", result);
    }

    @Test
    @DisplayName("Replaces special characters and collapses whitespace")
    void toSlug_specialCharacters_cleaned() {
        String input = "  Phòng @#$ sang --- giá   rẻ!  ";
        String result = SlugUtils.toSlug(input);
        assertEquals("phong-sang-gia-re", result);
    }

    @Test
    @DisplayName("Returns 'room' when input is null")
    void toSlug_nullInput_returnsDefault() {
        assertEquals("room", SlugUtils.toSlug(null));
    }

    @Test
    @DisplayName("Returns 'room' when input is blank")
    void toSlug_blankInput_returnsDefault() {
        assertEquals("room", SlugUtils.toSlug("   "));
    }
}
