package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.dto.auth.AuthResponse;
import com.trotot.backend.dto.auth.GoogleLoginRequest;
import com.trotot.backend.dto.auth.LoginRequest;
import com.trotot.backend.dto.auth.RegistrationOtpResponse;
import com.trotot.backend.dto.auth.RegisterRequest;
import com.trotot.backend.dto.auth.VerifyOtpRequest;
import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.Role;
import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.User;
import com.trotot.backend.entity.UserStatus;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.repository.RoleRepository;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.security.JwtService;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService - registration, login, OTP verification, refresh tokens")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private EmailNotificationService emailNotificationService;

    @Mock
    private GoogleIdentityService googleIdentityService;

    @Spy
    private AppProperties appProperties = new AppProperties();

    @InjectMocks
    private AuthService authService;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName(RoleName.USER);
    }

    @Test
    @DisplayName("Register creates inactive account, hashes OTP, and sends OTP email")
    void register_validRequest_returnsOtpResponse() {
        RegisterRequest request = new RegisterRequest("Nguyen Van An", "an@example.com", "123456", "0912345678");

        when(userRepository.existsByEmail("an@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$otp");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        RegistrationOtpResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("an@example.com", response.email());
        assertEquals(10L, response.expiresInMinutes());
        assertEquals(60L, response.resendCooldownSeconds());
        verify(emailNotificationService).sendRegistrationOtp(
                eq("an@example.com"),
                eq("Nguyen Van An"),
                anyString(),
                eq(10L));
    }

    @Test
    @DisplayName("Register with duplicate email throws BusinessException")
    void register_duplicateEmail_throwsBusinessException() {
        RegisterRequest request = new RegisterRequest("Test User", "existing@example.com", "123456", "");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.register(request));

        assertEquals("Email đã tồn tại trong hệ thống.", exception.getMessage());
    }

    @Test
    @DisplayName("Login succeeds and returns access + refresh token")
    void login_validCredentials_returnsAuthResponse() {
        LoginRequest request = new LoginRequest("an@example.com", "123456");
        User existingUser = verifiedUser("an@example.com");

        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(existingUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(jwtService.generateToken(any())).thenReturn("login-jwt-token");
        when(jwtService.getExpirationMinutes()).thenReturn(1440L);
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("login-refresh-token");
        when(refreshTokenService.getRefreshExpirationMinutes()).thenReturn(10080L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("login-jwt-token", response.accessToken());
        assertEquals("login-refresh-token", response.refreshToken());
        assertEquals("Nguyen Van An", response.user().fullName());
    }

    @Test
    @DisplayName("Login blocks local account before email verification")
    void login_unverifiedLocalAccount_throwsBusinessException() {
        LoginRequest request = new LoginRequest("an@example.com", "123456");
        User existingUser = verifiedUser("an@example.com");
        existingUser.setEmailVerified(false);
        existingUser.setEnabled(false);
        existingUser.setStatus(UserStatus.INACTIVE);

        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(existingUser));

        BusinessException exception = assertThrows(BusinessException.class, () -> authService.login(request));

        assertEquals("Tài khoản chưa xác minh email. Vui lòng nhập mã OTP đã gửi đến Gmail.", exception.getMessage());
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    @DisplayName("Verify OTP activates account and returns auth response")
    void verifyOtp_validOtp_activatesUserAndReturnsAuthResponse() {
        User user = unverifiedUser("an@example.com");
        user.setOtpHash("$2a$otp");
        user.setOtpExpiresAt(Instant.now().plusSeconds(300));

        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "$2a$otp")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any())).thenReturn("verify-jwt-token");
        when(jwtService.getExpirationMinutes()).thenReturn(1440L);
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("verify-refresh-token");
        when(refreshTokenService.getRefreshExpirationMinutes()).thenReturn(10080L);

        AuthResponse response = authService.verifyOtp(new VerifyOtpRequest("an@example.com", "123456"));

        assertEquals("verify-jwt-token", response.accessToken());
        assertTrue(user.isEmailVerified());
        assertTrue(user.isEnabled());
        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertNull(user.getOtpHash());
        assertNull(user.getOtpExpiresAt());
    }

    @Test
    @DisplayName("Verify OTP with wrong code increments attempts")
    void verifyOtp_wrongOtp_incrementsAttempts() {
        User user = unverifiedUser("an@example.com");
        user.setOtpHash("$2a$otp");
        user.setOtpExpiresAt(Instant.now().plusSeconds(300));

        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("000000", "$2a$otp")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> authService.verifyOtp(new VerifyOtpRequest("an@example.com", "000000")));

        assertEquals("Mã OTP không đúng. Vui lòng kiểm tra lại.", exception.getMessage());
        assertEquals(1, user.getOtpAttempts());
        assertFalse(user.isEmailVerified());
    }

    @Test
    @DisplayName("Google login creates account for new email")
    void loginWithGoogle_newEmail_createsUserAndReturnsAuthResponse() {
        when(googleIdentityService.verify("google-id-token"))
                .thenReturn(new GoogleIdentityService.GoogleAccount(
                        "google-123",
                        "google.user@example.com",
                        "Google User",
                        "https://example.com/avatar.jpg"));
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("google.user@example.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleName.USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$opaque");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(20L);
            return saved;
        });
        when(jwtService.generateToken(any())).thenReturn("google-jwt-token");
        when(jwtService.getExpirationMinutes()).thenReturn(1440L);
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("google-refresh-token");
        when(refreshTokenService.getRefreshExpirationMinutes()).thenReturn(10080L);

        AuthResponse response = authService.loginWithGoogle(new GoogleLoginRequest("google-id-token"));

        assertEquals("google-jwt-token", response.accessToken());
        assertEquals("google.user@example.com", response.user().email());
        assertEquals("Google User", response.user().fullName());
        assertEquals("https://example.com/avatar.jpg", response.user().avatarUrl());
        assertTrue(response.user().roles().contains("USER"));
    }

    @Test
    @DisplayName("Google login links existing unverified local account")
    void loginWithGoogle_existingUnverifiedLocalEmail_linksAndActivatesUser() {
        User user = unverifiedUser("an@example.com");
        user.setOtpHash("$2a$otp");
        user.setOtpExpiresAt(Instant.now().plusSeconds(300));

        when(googleIdentityService.verify("google-id-token"))
                .thenReturn(new GoogleIdentityService.GoogleAccount(
                        "google-456",
                        "an@example.com",
                        "Google Name",
                        "https://example.com/google-avatar.jpg"));
        when(userRepository.findByGoogleId("google-456")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any())).thenReturn("linked-google-jwt-token");
        when(jwtService.getExpirationMinutes()).thenReturn(1440L);
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("linked-google-refresh-token");
        when(refreshTokenService.getRefreshExpirationMinutes()).thenReturn(10080L);

        AuthResponse response = authService.loginWithGoogle(new GoogleLoginRequest("google-id-token"));

        assertEquals("linked-google-jwt-token", response.accessToken());
        assertEquals(AuthProvider.GOOGLE, user.getAuthProvider());
        assertEquals("google-456", user.getGoogleId());
        assertTrue(user.isEmailVerified());
        assertTrue(user.isEnabled());
        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertNull(user.getOtpHash());
        assertEquals("https://example.com/google-avatar.jpg", user.getAvatarUrl());
    }

    private User verifiedUser(String email) {
        User user = new User();
        user.setId(5L);
        user.setFullName("Nguyen Van An");
        user.setEmail(email);
        user.setPasswordHash("$2a$password");
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setRoles(Set.of(userRole));
        return user;
    }

    private User unverifiedUser(String email) {
        User user = verifiedUser(email);
        user.setEmailVerified(false);
        user.setEnabled(false);
        user.setStatus(UserStatus.INACTIVE);
        user.setOtpAttempts(0);
        user.setOtpResendCount(0);
        return user;
    }
}
