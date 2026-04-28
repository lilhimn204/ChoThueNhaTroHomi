package com.trotot.backend.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;

@DisplayName("CookieUtils - auth cookie flags")
class CookieUtilsTest {

    @Test
    @DisplayName("addAuthCookie respects secure flag")
    void addAuthCookie_secureFlag_writesSecureAttribute() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        CookieUtils.addAuthCookie(response, "token-value", 3600, true);

        String header = response.getHeader("Set-Cookie");
        assertNotNull(header);
        assertTrue(header.contains("HttpOnly"));
        assertTrue(header.contains("Secure"));
        assertTrue(header.contains("SameSite=Lax"));
    }

    @Test
    @DisplayName("clearAuthCookie can omit secure flag for local development")
    void clearAuthCookie_localCookie_omitsSecureAttribute() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        CookieUtils.clearAuthCookie(response, false);

        String header = response.getHeader("Set-Cookie");
        assertNotNull(header);
        assertTrue(header.contains("Max-Age=0"));
        assertFalse(header.contains("Secure"));
    }
}
