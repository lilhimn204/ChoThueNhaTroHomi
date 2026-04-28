package com.trotot.backend.security;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * In-memory rate limiter for authentication endpoints.
 * Protects against brute-force attacks by limiting requests per IP.
 *
 * <p>Uses a sliding window counter per client IP address. When the limit is
 * exceeded within the configured window, the filter returns HTTP 429.</p>
 *
 * <p>Targets only: POST /api/v1/auth/**</p>
 */
@Slf4j
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_SECONDS = 60;
    private static final String AUTH_PATH_PREFIX = "/api/v1/auth/";

    private static final long CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

    private final ConcurrentMap<String, RateWindow> clients = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public RateLimitFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Periodically remove expired rate-limit entries to prevent memory leak.
     */
    @Scheduled(fixedRate = CLEANUP_INTERVAL_MS)
    public void cleanupExpiredEntries() {
        Instant now = Instant.now();
        int before = clients.size();
        clients.entrySet().removeIf(entry -> entry.getValue().isExpired(now));
        int removed = before - clients.size();

        if (removed > 0) {
            log.debug("Rate-limit cleanup: removed {} expired entries, {} remaining", removed, clients.size());
        }
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Only rate-limit POST requests to auth endpoints
        return !("POST".equalsIgnoreCase(method) && path.startsWith(AUTH_PATH_PREFIX));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = resolveClientIp(request);
        RateWindow window = clients.compute(clientIp, (key, existing) -> {
            Instant now = Instant.now();

            if (existing == null || existing.isExpired(now)) {
                return new RateWindow(now, 1);
            }

            existing.increment();
            return existing;
        });

        if (window.getCount() > MAX_REQUESTS) {
            log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIp, request.getRequestURI());
            writeRateLimitResponse(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");

        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");

        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        return request.getRemoteAddr();
    }

    private void writeRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        var body = java.util.Map.of(
                "status", 429,
                "message", "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau " + WINDOW_SECONDS + " giây."
        );

        objectMapper.writeValue(response.getOutputStream(), body);
    }

    /**
     * Represents a rate-limiting time window for a single client.
     */
    private static class RateWindow {
        private final Instant windowStart;
        private int count;

        RateWindow(Instant windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }

        boolean isExpired(Instant now) {
            return now.isAfter(windowStart.plusSeconds(WINDOW_SECONDS));
        }

        void increment() {
            this.count++;
        }

        int getCount() {
            return count;
        }
    }
}
