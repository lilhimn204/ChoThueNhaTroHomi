package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.entity.RefreshToken;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.repository.RefreshTokenRepository;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenService — token lifecycle")
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private AppProperties appProperties;

    @Mock
    private AppProperties.Jwt jwtProperties;

    private RefreshTokenService refreshTokenService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        lenient().when(appProperties.getJwt()).thenReturn(jwtProperties);
        lenient().when(jwtProperties.getRefreshExpirationMinutes()).thenReturn(10080L);

        refreshTokenService = new RefreshTokenService(refreshTokenRepository, appProperties);

        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setFullName("Test User");
        sampleUser.setEmail("test@example.com");
    }

    @Test
    @DisplayName("createRefreshToken saves a hashed token and returns raw token")
    void createRefreshToken_savesHashedToken_returnsRawToken() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        String rawToken = refreshTokenService.createRefreshToken(sampleUser);

        assertNotNull(rawToken);
        assertFalse(rawToken.isBlank());

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken savedToken = captor.getValue();
        assertNotNull(savedToken.getTokenHash());
        assertNotEquals(rawToken, savedToken.getTokenHash());
        assertNotNull(savedToken.getExpiresAt());
        assertTrue(savedToken.getExpiresAt().isAfter(Instant.now()));
    }

    @Test
    @DisplayName("createRefreshToken generates unique tokens")
    void createRefreshToken_generatesUniqueTokens() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        String token1 = refreshTokenService.createRefreshToken(sampleUser);
        String token2 = refreshTokenService.createRefreshToken(sampleUser);

        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("revoke does nothing for null token")
    void revoke_nullToken_doesNothing() {
        assertDoesNotThrow(() -> refreshTokenService.revoke(null));
        verify(refreshTokenRepository, never()).findByTokenHash(any());
    }

    @Test
    @DisplayName("revoke does nothing for blank token")
    void revoke_blankToken_doesNothing() {
        assertDoesNotThrow(() -> refreshTokenService.revoke("   "));
        verify(refreshTokenRepository, never()).findByTokenHash(any());
    }

    @Test
    @DisplayName("rotate throws BusinessException for null token")
    void rotate_nullToken_throwsBusinessException() {
        BusinessException exception = assertThrows(BusinessException.class,
                () -> refreshTokenService.rotate(null));
        assertTrue(exception.getMessage().contains("không hợp lệ"));
    }

    @Test
    @DisplayName("rotate throws BusinessException for unknown token")
    void rotate_unknownToken_throwsBusinessException() {
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        assertThrows(BusinessException.class,
                () -> refreshTokenService.rotate("some-unknown-token"));
    }

    @Test
    @DisplayName("rotate throws BusinessException for expired token")
    void rotate_expiredToken_throwsBusinessException() {
        RefreshToken expiredToken = new RefreshToken();
        expiredToken.setUser(sampleUser);
        expiredToken.setExpiresAt(Instant.now().minusSeconds(3600));

        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(expiredToken));

        assertThrows(BusinessException.class,
                () -> refreshTokenService.rotate("expired-token"));
    }

    @Test
    @DisplayName("rotate throws BusinessException for revoked token")
    void rotate_revokedToken_throwsBusinessException() {
        RefreshToken revokedToken = new RefreshToken();
        revokedToken.setUser(sampleUser);
        revokedToken.setExpiresAt(Instant.now().plusSeconds(3600));
        revokedToken.setRevokedAt(Instant.now().minusSeconds(60));

        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(revokedToken));

        assertThrows(BusinessException.class,
                () -> refreshTokenService.rotate("revoked-token"));
    }
}
