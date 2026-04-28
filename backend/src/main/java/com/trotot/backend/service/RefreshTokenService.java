package com.trotot.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.entity.RefreshToken;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;

    private final RefreshTokenRepository refreshTokenRepository;
    private final AppProperties appProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, AppProperties appProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.appProperties = appProperties;
    }

    @Transactional
    public String createRefreshToken(User user) {
        String rawToken = generateRawToken();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(rawToken));
        refreshToken.setExpiresAt(Instant.now().plusSeconds(getRefreshExpirationMinutes() * 60));
        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Transactional
    public RefreshTokenRotation rotate(String rawToken) {
        RefreshToken currentToken = findValidToken(rawToken);
        currentToken.setRevokedAt(Instant.now());

        String newRawToken = createRefreshToken(currentToken.getUser());
        return new RefreshTokenRotation(currentToken.getUser(), newRawToken);
    }

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHash(hashToken(rawToken))
                .filter(token -> !token.isRevoked())
                .ifPresent(token -> token.setRevokedAt(Instant.now()));
    }

    @Transactional
    public void revokeActiveTokensForUser(Long userId) {
        refreshTokenRepository.revokeActiveTokensByUserId(userId, Instant.now());
    }

    public long getRefreshExpirationMinutes() {
        return appProperties.getJwt().getRefreshExpirationMinutes();
    }

    private RefreshToken findValidToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new BusinessException("Refresh token không hợp lệ.");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new BusinessException("Refresh token không hợp lệ."));

        Instant now = Instant.now();
        if (refreshToken.isRevoked() || refreshToken.isExpired(now)) {
            throw new BusinessException("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }

        return refreshToken;
    }

    private String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available.", exception);
        }
    }

    public record RefreshTokenRotation(User user, String refreshToken) {
    }
}
