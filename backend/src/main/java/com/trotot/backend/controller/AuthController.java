package com.trotot.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.dto.auth.AuthResponse;
import com.trotot.backend.dto.auth.LoginRequest;
import com.trotot.backend.dto.auth.RefreshTokenRequest;
import com.trotot.backend.dto.auth.RegisterRequest;
import com.trotot.backend.service.AuthService;
import com.trotot.backend.util.CookieUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final AppProperties appProperties;

    public AuthController(AuthService authService, AppProperties appProperties) {
        this.authService = authService;
        this.appProperties = appProperties;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse response) {
        String refreshToken = request != null && request.refreshToken() != null
                ? request.refreshToken()
                : CookieUtils.extractRefreshTokenFromCookie(servletRequest);

        AuthResponse authResponse = authService.refresh(refreshToken);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(CookieUtils.extractRefreshTokenFromCookie(request));
        boolean secure = appProperties.getCookie().isSecure();
        CookieUtils.clearAuthCookie(response, secure);
        CookieUtils.clearRefreshCookie(response, secure);
        return ResponseEntity.noContent().build();
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        boolean secure = appProperties.getCookie().isSecure();
        CookieUtils.addAuthCookie(response, authResponse.accessToken(), authResponse.expiresInMinutes() * 60, secure);
        CookieUtils.addRefreshCookie(response, authResponse.refreshToken(), authResponse.refreshExpiresInMinutes() * 60, secure);
    }
}
