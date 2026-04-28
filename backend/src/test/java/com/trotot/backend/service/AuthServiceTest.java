package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.trotot.backend.dto.auth.AuthResponse;
import com.trotot.backend.dto.auth.LoginRequest;
import com.trotot.backend.dto.auth.RegisterRequest;
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
@DisplayName("AuthService - registration, login, refresh tokens")
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
    @DisplayName("Register succeeds and returns access + refresh token")
    void register_validRequest_returnsAuthResponse() {
        RegisterRequest request = new RegisterRequest("Nguyen Van An", "an@example.com", "123456", "0912345678");

        when(userRepository.existsByEmail("an@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("123456")).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });
        when(jwtService.generateToken(any())).thenReturn("mock-jwt-token");
        when(jwtService.getExpirationMinutes()).thenReturn(1440L);
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("mock-refresh-token");
        when(refreshTokenService.getRefreshExpirationMinutes()).thenReturn(10080L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.accessToken());
        assertEquals("mock-refresh-token", response.refreshToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals("Nguyen Van An", response.user().fullName());
        assertEquals("an@example.com", response.user().email());
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

        User existingUser = new User();
        existingUser.setId(5L);
        existingUser.setFullName("Nguyen Van An");
        existingUser.setEmail("an@example.com");
        existingUser.setPasswordHash("$2a$encoded");
        existingUser.setStatus(UserStatus.ACTIVE);
        existingUser.setEnabled(true);
        existingUser.setRoles(Set.of(userRole));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("an@example.com")).thenReturn(Optional.of(existingUser));
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
}
