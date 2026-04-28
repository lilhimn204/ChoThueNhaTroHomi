package com.trotot.backend.service;

import java.util.Comparator;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.auth.AuthResponse;
import com.trotot.backend.dto.auth.AuthUserResponse;
import com.trotot.backend.dto.auth.LoginRequest;
import com.trotot.backend.dto.auth.RegisterRequest;
import com.trotot.backend.util.InputSanitizer;
import com.trotot.backend.entity.Role;
import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.User;
import com.trotot.backend.entity.UserStatus;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.repository.RoleRepository;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.security.JwtService;
import com.trotot.backend.security.UserPrincipal;

import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("null")
@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            log.warn("Registration failed: email already exists - {}", email);
            throw new BusinessException("Email đã tồn tại trong hệ thống.");
        }

        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new BusinessException("Hệ thống chưa được khởi tạo role USER."));

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(InputSanitizer.trimToNull(request.phone()));
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        user.getRoles().add(userRole);

        User savedUser = userRepository.save(user);
        log.info("User registered: id={}, email={}", savedUser.getId(), email);
        return buildAuthResponse(savedUser, refreshTokenService.createRefreshToken(savedUser));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (Exception ex) {
            log.warn("Login failed for email: {} - {}", email, ex.getMessage());
            throw ex;
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Email hoặc mật khẩu không hợp lệ."));

        log.info("Login successful: id={}, email={}", user.getId(), email);
        return buildAuthResponse(user, refreshTokenService.createRefreshToken(user));
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        RefreshTokenService.RefreshTokenRotation rotation = refreshTokenService.rotate(refreshToken);
        log.info("Token refreshed: id={}, email={}", rotation.user().getId(), rotation.user().getEmail());
        return buildAuthResponse(rotation.user(), rotation.refreshToken());
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
        log.info("User logged out (refresh token revoked)");
    }

    private AuthResponse buildAuthResponse(User user, String refreshToken) {
        UserPrincipal principal = UserPrincipal.fromUser(user);
        String token = jwtService.generateToken(principal);
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .map(Enum::name)
                .sorted(Comparator.naturalOrder())
                .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));

        return new AuthResponse(
                token,
                refreshToken,
                "Bearer",
                jwtService.getExpirationMinutes(),
                refreshTokenService.getRefreshExpirationMinutes(),
                new AuthUserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAvatarUrl(),
                        user.getStatus(),
                        roles));
    }

}
