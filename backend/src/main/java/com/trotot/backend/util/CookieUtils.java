package com.trotot.backend.util;

import org.springframework.http.ResponseCookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Utility class for managing authentication cookies.
 * Uses HttpOnly cookies to prevent JavaScript access (XSS protection).
 */
@SuppressWarnings("null")
public final class CookieUtils {

    public static final String AUTH_COOKIE_NAME = "homi_token";
    public static final String REFRESH_COOKIE_NAME = "homi_refresh_token";

    private CookieUtils() {
    }

    /**
     * Sets an HttpOnly cookie with the JWT access token on the response.
     */
    public static void addAuthCookie(HttpServletResponse response, String token, long maxAgeSeconds, boolean secure) {
        addCookie(response, AUTH_COOKIE_NAME, token, maxAgeSeconds, secure);
    }

    /**
     * Sets an HttpOnly cookie with the opaque refresh token on the response.
     */
    public static void addRefreshCookie(HttpServletResponse response, String token, long maxAgeSeconds, boolean secure) {
        addCookie(response, REFRESH_COOKIE_NAME, token, maxAgeSeconds, secure);
    }

    /**
     * Clears the authentication cookie by setting maxAge to 0.
     */
    public static void clearAuthCookie(HttpServletResponse response, boolean secure) {
        clearCookie(response, AUTH_COOKIE_NAME, secure);
    }

    public static void clearRefreshCookie(HttpServletResponse response, boolean secure) {
        clearCookie(response, REFRESH_COOKIE_NAME, secure);
    }

    /**
     * Extracts the JWT access token from the request cookie.
     *
     * @return the token string, or null if cookie not found
     */
    public static String extractTokenFromCookie(HttpServletRequest request) {
        return extractCookieValue(request, AUTH_COOKIE_NAME);
    }

    public static String extractRefreshTokenFromCookie(HttpServletRequest request) {
        return extractCookieValue(request, REFRESH_COOKIE_NAME);
    }

    public static String extractCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                String value = cookie.getValue();
                return (value != null && !value.isBlank()) ? value : null;
            }
        }

        return null;
    }

    private static void addCookie(HttpServletResponse response, String name, String value, long maxAgeSeconds, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    private static void clearCookie(HttpServletResponse response, String name, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}
