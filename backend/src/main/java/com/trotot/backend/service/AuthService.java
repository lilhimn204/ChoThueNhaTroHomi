package com.trotot.backend.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Comparator;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.dto.auth.AuthResponse;
import com.trotot.backend.dto.auth.AuthUserResponse;
import com.trotot.backend.dto.auth.ForgotPasswordRequest;
import com.trotot.backend.dto.auth.GoogleLoginRequest;
import com.trotot.backend.dto.auth.LoginRequest;
import com.trotot.backend.dto.auth.PasswordResetOtpResponse;
import com.trotot.backend.dto.auth.RegistrationOtpResponse;
import com.trotot.backend.dto.auth.RegisterRequest;
import com.trotot.backend.dto.auth.ResendOtpRequest;
import com.trotot.backend.dto.auth.ResetPasswordRequest;
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
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("null")
@Slf4j
@Service
public class AuthService {

    private static final int OTP_BOUND = 1_000_000;
    private static final int GENERATED_PASSWORD_BYTES = 32;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailNotificationService emailNotificationService;
    private final GoogleIdentityService googleIdentityService;
    private final AppProperties appProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            EmailNotificationService emailNotificationService,
            GoogleIdentityService googleIdentityService,
            AppProperties appProperties) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.emailNotificationService = emailNotificationService;
        this.googleIdentityService = googleIdentityService;
        this.appProperties = appProperties;
    }

    @Transactional
    public RegistrationOtpResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
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
        user.setStatus(UserStatus.INACTIVE);
        user.setEnabled(false);
        user.setEmailVerified(false);
        user.setAuthProvider(AuthProvider.LOCAL);
        user.getRoles().add(userRole);

        String otp = prepareOtp(user, false);
        User savedUser = userRepository.save(user);
        emailNotificationService.sendRegistrationOtp(
                savedUser.getEmail(),
                savedUser.getFullName(),
                otp,
                appProperties.getOtp().getExpirationMinutes());

        log.info("User registered pending email verification: id={}, email={}", savedUser.getId(), email);
        return buildRegistrationOtpResponse(savedUser.getEmail(), "Mã OTP đã được gửi đến email đăng ký.");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (isLocalEmailUnverified(existingUser)) {
            log.warn("Login blocked for unverified email: {}", email);
            throw new BusinessException("Tài khoản chưa xác minh email. Vui lòng nhập mã OTP đã gửi đến Gmail.");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (Exception ex) {
            log.warn("Login failed for email: {} - {}", email, ex.getMessage());
            throw ex;
        }

        User user = existingUser != null
                ? existingUser
                : userRepository.findByEmail(email)
                        .orElseThrow(() -> new BusinessException("Email hoặc mật khẩu không hợp lệ."));

        log.info("Login successful: id={}, email={}", user.getId(), email);
        return buildAuthResponse(user, refreshTokenService.createRefreshToken(user));
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        GoogleIdentityService.GoogleAccount googleAccount = googleIdentityService.verify(request.idToken());

        User user = userRepository.findByGoogleId(googleAccount.googleId()).orElse(null);
        if (user == null) {
            user = userRepository.findByEmail(googleAccount.email()).orElse(null);
        }

        if (user == null) {
            user = createGoogleUser(googleAccount);
        } else {
            ensureGoogleLoginAllowed(user);
            linkGoogleIdentity(user, googleAccount);
        }

        ensureDefaultRoleIfMissing(user);
        User savedUser = userRepository.save(user);

        log.info("Google login successful: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        return buildAuthResponse(savedUser, refreshTokenService.createRefreshToken(savedUser));
    }

    @Transactional(noRollbackFor = BusinessException.class)
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tài khoản cần xác minh."));

        validateOtpTarget(user);

        if (user.getOtpHash() == null || user.getOtpExpiresAt() == null) {
            throw new BusinessException("Mã OTP không còn hiệu lực. Vui lòng gửi lại mã mới.");
        }

        Instant now = Instant.now();
        if (now.isAfter(user.getOtpExpiresAt())) {
            throw new BusinessException("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
        }

        if (user.getOtpAttempts() >= appProperties.getOtp().getMaxAttempts()) {
            throw new BusinessException("Bạn đã nhập sai OTP quá số lần cho phép. Vui lòng gửi lại mã mới.");
        }

        if (!passwordEncoder.matches(request.otp(), user.getOtpHash())) {
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);
            throw new BusinessException("Mã OTP không đúng. Vui lòng kiểm tra lại.");
        }

        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        clearOtp(user);

        User savedUser = userRepository.save(user);
        log.info("Email verified: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        return buildAuthResponse(savedUser, refreshTokenService.createRefreshToken(savedUser));
    }

    @Transactional
    public RegistrationOtpResponse resendOtp(ResendOtpRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tài khoản cần xác minh."));

        validateOtpTarget(user);

        Instant now = Instant.now();
        Instant nextAllowedAt = user.getOtpLastSentAt() == null
                ? Instant.EPOCH
                : user.getOtpLastSentAt().plusSeconds(appProperties.getOtp().getResendCooldownSeconds());
        if (now.isBefore(nextAllowedAt)) {
            long seconds = Math.max(1, nextAllowedAt.getEpochSecond() - now.getEpochSecond());
            throw new BusinessException("Vui lòng chờ " + seconds + " giây trước khi gửi lại OTP.");
        }

        if (user.getOtpResendCount() >= appProperties.getOtp().getMaxResendCount()) {
            throw new BusinessException("Bạn đã vượt quá số lần gửi lại OTP. Vui lòng thử lại sau.");
        }

        String otp = prepareOtp(user, true);
        User savedUser = userRepository.save(user);
        emailNotificationService.sendRegistrationOtp(
                savedUser.getEmail(),
                savedUser.getFullName(),
                otp,
                appProperties.getOtp().getExpirationMinutes());

        log.info("Registration OTP resent: id={}, email={}, resendCount={}",
                savedUser.getId(), savedUser.getEmail(), savedUser.getOtpResendCount());
        return buildRegistrationOtpResponse(savedUser.getEmail(), "Mã OTP mới đã được gửi đến email đăng ký.");
    }

    @Transactional
    public PasswordResetOtpResponse requestPasswordReset(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.info("Password reset requested for unknown email: {}", email);
            return buildPasswordResetOtpResponse(email, "Nếu email tồn tại trong hệ thống, mã OTP đặt lại mật khẩu sẽ được gửi đến Gmail.");
        }

        validatePasswordResetTarget(user);
        Instant now = Instant.now();
        ensurePasswordResetSendAllowed(user, now);

        String otp = preparePasswordResetOtp(user, hasActivePasswordResetOtp(user, now));
        User savedUser = userRepository.save(user);
        emailNotificationService.sendPasswordResetOtp(
                savedUser.getEmail(),
                savedUser.getFullName(),
                otp,
                appProperties.getOtp().getExpirationMinutes());

        log.info("Password reset OTP sent: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        return buildPasswordResetOtpResponse(savedUser.getEmail(), "Mã OTP đặt lại mật khẩu đã được gửi đến Gmail.");
    }

    @Transactional
    public PasswordResetOtpResponse resendPasswordResetOtp(ResendOtpRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.info("Password reset resend requested for unknown email: {}", email);
            return buildPasswordResetOtpResponse(email, "Nếu email tồn tại trong hệ thống, mã OTP đặt lại mật khẩu sẽ được gửi đến Gmail.");
        }

        validatePasswordResetTarget(user);
        Instant now = Instant.now();
        ensurePasswordResetSendAllowed(user, now);

        String otp = preparePasswordResetOtp(user, hasActivePasswordResetOtp(user, now));
        User savedUser = userRepository.save(user);
        emailNotificationService.sendPasswordResetOtp(
                savedUser.getEmail(),
                savedUser.getFullName(),
                otp,
                appProperties.getOtp().getExpirationMinutes());

        log.info("Password reset OTP resent: id={}, email={}, resendCount={}",
                savedUser.getId(), savedUser.getEmail(), savedUser.getPasswordResetOtpResendCount());
        return buildPasswordResetOtpResponse(savedUser.getEmail(), "Mã OTP đặt lại mật khẩu mới đã được gửi đến Gmail.");
    }

    @Transactional(noRollbackFor = BusinessException.class)
    public void resetPassword(ResetPasswordRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tài khoản cần đặt lại mật khẩu."));

        validatePasswordResetTarget(user);

        if (user.getPasswordResetOtpHash() == null || user.getPasswordResetOtpExpiresAt() == null) {
            throw new BusinessException("Mã OTP đặt lại mật khẩu không còn hiệu lực. Vui lòng gửi lại mã mới.");
        }

        Instant now = Instant.now();
        if (now.isAfter(user.getPasswordResetOtpExpiresAt())) {
            throw new BusinessException("Mã OTP đặt lại mật khẩu đã hết hạn. Vui lòng gửi lại mã mới.");
        }

        if (user.getPasswordResetOtpAttempts() >= appProperties.getOtp().getMaxAttempts()) {
            throw new BusinessException("Bạn đã nhập sai OTP quá số lần cho phép. Vui lòng gửi lại mã mới.");
        }

        if (!passwordEncoder.matches(request.otp(), user.getPasswordResetOtpHash())) {
            user.setPasswordResetOtpAttempts(user.getPasswordResetOtpAttempts() + 1);
            userRepository.save(user);
            throw new BusinessException("Mã OTP không đúng. Vui lòng kiểm tra lại.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mật khẩu mới phải khác mật khẩu hiện tại.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setEmailVerified(true);
        if (user.getStatus() == UserStatus.INACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
            user.setEnabled(true);
        }
        clearPasswordResetOtp(user);

        User savedUser = userRepository.save(user);
        refreshTokenService.revokeActiveTokensForUser(savedUser.getId());
        log.info("Password reset completed: id={}, email={}", savedUser.getId(), savedUser.getEmail());
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

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private User createGoogleUser(GoogleIdentityService.GoogleAccount googleAccount) {
        User user = new User();
        user.setFullName(resolveGoogleFullName(googleAccount));
        user.setEmail(googleAccount.email());
        user.setPasswordHash(passwordEncoder.encode(generateOpaquePassword()));
        user.setAvatarUrl(InputSanitizer.trimToNull(googleAccount.avatarUrl()));
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setGoogleId(googleAccount.googleId());
        ensureDefaultRoleIfMissing(user);
        return user;
    }

    private void linkGoogleIdentity(User user, GoogleIdentityService.GoogleAccount googleAccount) {
        if (StringUtils.hasText(user.getGoogleId()) && !user.getGoogleId().equals(googleAccount.googleId())) {
            throw new BusinessException("Email này đã được liên kết với một tài khoản Google khác.");
        }

        user.setGoogleId(googleAccount.googleId());
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setEmailVerified(true);

        if (!user.isEnabled() && user.getStatus() == UserStatus.INACTIVE) {
            user.setEnabled(true);
            user.setStatus(UserStatus.ACTIVE);
        }

        if (!StringUtils.hasText(user.getFullName())) {
            user.setFullName(resolveGoogleFullName(googleAccount));
        }

        if (StringUtils.hasText(googleAccount.avatarUrl())) {
            user.setAvatarUrl(googleAccount.avatarUrl());
        }

        clearOtp(user);
    }

    private void ensureGoogleLoginAllowed(User user) {
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        if (user.isEmailVerified() && (!user.isEnabled() || user.getStatus() != UserStatus.ACTIVE)) {
            throw new BusinessException("Tài khoản đang bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
        }
    }

    private void ensureDefaultRoleIfMissing(User user) {
        if (!user.getRoles().isEmpty()) {
            return;
        }

        user.getRoles().add(roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new BusinessException("Hệ thống chưa được khởi tạo role USER.")));
    }

    private String resolveGoogleFullName(GoogleIdentityService.GoogleAccount googleAccount) {
        String fullName = InputSanitizer.sanitize(googleAccount.fullName());
        if (StringUtils.hasText(fullName)) {
            return fullName;
        }

        int atIndex = googleAccount.email().indexOf('@');
        return atIndex > 0 ? googleAccount.email().substring(0, atIndex) : googleAccount.email();
    }

    private String generateOpaquePassword() {
        byte[] bytes = new byte[GENERATED_PASSWORD_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private boolean isLocalEmailUnverified(User user) {
        return user != null
                && user.getAuthProvider() == AuthProvider.LOCAL
                && !user.isEmailVerified();
    }

    private void validateOtpTarget(User user) {
        if (user.getAuthProvider() != AuthProvider.LOCAL) {
            throw new BusinessException("Tài khoản này không sử dụng xác minh OTP.");
        }

        if (user.isEmailVerified()) {
            throw new BusinessException("Email này đã được xác minh.");
        }
    }

    private void validatePasswordResetTarget(User user) {
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        if (!user.isEmailVerified()) {
            throw new BusinessException("Tài khoản chưa xác minh email. Vui lòng hoàn tất xác minh đăng ký trước.");
        }
    }

    private void ensurePasswordResetSendAllowed(User user, Instant now) {
        Instant nextAllowedAt = user.getPasswordResetOtpLastSentAt() == null
                ? Instant.EPOCH
                : user.getPasswordResetOtpLastSentAt().plusSeconds(appProperties.getOtp().getResendCooldownSeconds());
        if (now.isBefore(nextAllowedAt)) {
            long seconds = Math.max(1, nextAllowedAt.getEpochSecond() - now.getEpochSecond());
            throw new BusinessException("Vui lòng chờ " + seconds + " giây trước khi gửi lại OTP.");
        }

        if (hasActivePasswordResetOtp(user, now)
                && user.getPasswordResetOtpResendCount() >= appProperties.getOtp().getMaxResendCount()) {
            throw new BusinessException("Bạn đã vượt quá số lần gửi lại OTP. Vui lòng thử lại sau.");
        }
    }

    private boolean hasActivePasswordResetOtp(User user, Instant now) {
        return user.getPasswordResetOtpHash() != null
                && user.getPasswordResetOtpExpiresAt() != null
                && now.isBefore(user.getPasswordResetOtpExpiresAt());
    }

    private String prepareOtp(User user, boolean resend) {
        String otp = generateOtp();
        Instant now = Instant.now();

        user.setOtpHash(passwordEncoder.encode(otp));
        user.setOtpExpiresAt(now.plusSeconds(appProperties.getOtp().getExpirationMinutes() * 60));
        user.setOtpAttempts(0);
        user.setOtpLastSentAt(now);

        if (resend) {
            user.setOtpResendCount(user.getOtpResendCount() + 1);
        } else {
            user.setOtpResendCount(0);
        }

        return otp;
    }

    private String preparePasswordResetOtp(User user, boolean resend) {
        String otp = generateOtp();
        Instant now = Instant.now();

        user.setPasswordResetOtpHash(passwordEncoder.encode(otp));
        user.setPasswordResetOtpExpiresAt(now.plusSeconds(appProperties.getOtp().getExpirationMinutes() * 60));
        user.setPasswordResetOtpAttempts(0);
        user.setPasswordResetOtpLastSentAt(now);

        if (resend) {
            user.setPasswordResetOtpResendCount(user.getPasswordResetOtpResendCount() + 1);
        } else {
            user.setPasswordResetOtpResendCount(0);
        }

        return otp;
    }

    private String generateOtp() {
        return String.format("%06d", secureRandom.nextInt(OTP_BOUND));
    }

    private void clearOtp(User user) {
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        user.setOtpAttempts(0);
        user.setOtpResendCount(0);
        user.setOtpLastSentAt(null);
    }

    private void clearPasswordResetOtp(User user) {
        user.setPasswordResetOtpHash(null);
        user.setPasswordResetOtpExpiresAt(null);
        user.setPasswordResetOtpAttempts(0);
        user.setPasswordResetOtpResendCount(0);
        user.setPasswordResetOtpLastSentAt(null);
    }

    private RegistrationOtpResponse buildRegistrationOtpResponse(String email, String message) {
        return new RegistrationOtpResponse(
                email,
                appProperties.getOtp().getExpirationMinutes(),
                appProperties.getOtp().getResendCooldownSeconds(),
                message);
    }

    private PasswordResetOtpResponse buildPasswordResetOtpResponse(String email, String message) {
        return new PasswordResetOtpResponse(
                email,
                appProperties.getOtp().getExpirationMinutes(),
                appProperties.getOtp().getResendCooldownSeconds(),
                message);
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
