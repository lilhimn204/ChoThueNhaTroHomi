package com.trotot.backend.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.user.AdminUserResponse;
import com.trotot.backend.dto.user.ChangePasswordRequest;
import com.trotot.backend.dto.user.SetPasswordRequest;
import com.trotot.backend.dto.user.UpdateUserProfileRequest;
import com.trotot.backend.dto.user.UpdateUserRolesRequest;
import com.trotot.backend.dto.user.UpdateUserStatusRequest;
import com.trotot.backend.dto.user.UserProfileResponse;
import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.Role;
import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.User;
import com.trotot.backend.entity.UserStatus;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.RoleRepository;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UserPrincipal principal) {
        return toUserProfileResponse(getRequiredUserEntity(principal.getId()));
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UserPrincipal principal, UpdateUserProfileRequest request) {
        User user = getRequiredUserEntity(principal.getId());
        user.setFullName(InputSanitizer.sanitizeRequired(request.fullName()));
        user.setPhone(InputSanitizer.trimToNull(request.phone()));
        user.setAvatarUrl(InputSanitizer.trimToNull(request.avatarUrl()));
        return toUserProfileResponse(userRepository.save(user));
    }

    @Transactional
    public void changeCurrentUserPassword(UserPrincipal principal, ChangePasswordRequest request) {
        User user = getRequiredUserEntity(principal.getId());

        if (!user.isPasswordConfigured()) {
            throw new BusinessException("Tài khoản chưa có mật khẩu. Vui lòng tạo mật khẩu trước.");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mật khẩu hiện tại không đúng.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mật khẩu mới phải khác mật khẩu hiện tại.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password changed: userId={}", user.getId());
    }

    @Transactional
    public void setCurrentUserPassword(UserPrincipal principal, SetPasswordRequest request) {
        User user = getRequiredUserEntity(principal.getId());

        if (user.isPasswordConfigured()) {
            throw new BusinessException("Tài khoản đã có mật khẩu. Vui lòng dùng chức năng đổi mật khẩu.");
        }

        if (user.getAuthProvider() != AuthProvider.GOOGLE) {
            throw new BusinessException("Chỉ tài khoản Google chưa có mật khẩu mới được tạo mật khẩu.");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException("Mật khẩu xác nhận không khớp.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordConfigured(true);
        userRepository.save(user);
        log.info("Password configured: userId={}", user.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> searchUsers(
            String keyword,
            UserStatus status,
            RoleName roleName,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        var users = userRepository.searchUsers(InputSanitizer.trimToNull(keyword), status, roleName, pageable);
        return PageResponse.from(users, this::toAdminUserResponse);
    }

    @Transactional
    public AdminUserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request, Long adminUserId) {
        User user = getRequiredUserEntity(userId);
        boolean locking = request.status() == UserStatus.LOCKED || Boolean.FALSE.equals(request.enabled());

        if (locking && userId.equals(adminUserId)) {
            throw new BusinessException("Bạn không thể tự khóa tài khoản quản trị đang đăng nhập.");
        }

        if (locking && user.hasRole(RoleName.ADMIN) && userRepository.countDistinctByRoleName(RoleName.ADMIN) <= 1) {
            throw new BusinessException("Không thể khóa quản trị viên cuối cùng của hệ thống.");
        }

        user.setStatus(request.status());
        user.setEnabled(request.enabled() == null ? user.isEnabled() : request.enabled());

        if (user.getStatus() == UserStatus.LOCKED || !user.isEnabled()) {
            user.setStatus(UserStatus.LOCKED);
            user.setEnabled(false);
            user.setLockReason(InputSanitizer.trimToNull(request.lockReason()));
            user.setLockedAt(Instant.now());
        } else {
            user.setLockReason(null);
            user.setLockedAt(null);
        }

        log.info("User status updated: userId={}, status={}, enabled={}", userId, user.getStatus(), user.isEnabled());
        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getAdminUserDetail(Long userId) {
        return toAdminUserResponse(getRequiredUserEntity(userId));
    }

    @Transactional
    public AdminUserResponse updateUserRoles(Long userId, UpdateUserRolesRequest request, Long adminUserId) {
        User user = getRequiredUserEntity(userId);
        Set<RoleName> requestedRoles = request.roles();

        if (requestedRoles.isEmpty()) {
            throw new BusinessException("Người dùng phải có ít nhất một vai trò.");
        }

        boolean removingAdmin = user.hasRole(RoleName.ADMIN) && !requestedRoles.contains(RoleName.ADMIN);

        if (removingAdmin && userId.equals(adminUserId)) {
            throw new BusinessException("Bạn không thể tự hạ quyền quản trị của chính mình.");
        }

        if (removingAdmin && userRepository.countDistinctByRoleName(RoleName.ADMIN) <= 1) {
            throw new BusinessException("Không thể hạ quyền quản trị viên cuối cùng của hệ thống.");
        }

        Set<Role> roles = requestedRoles.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò " + roleName)))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        user.setRoles(roles);
        log.info("User roles updated: userId={}, roles={}", userId, requestedRoles);
        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse verifyUserEmail(Long userId) {
        User user = getRequiredUserEntity(userId);
        user.setEmailVerified(true);
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        user.setOtpAttempts(0);
        user.setOtpResendCount(0);
        user.setOtpLastSentAt(null);

        if (user.getStatus() == UserStatus.INACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
            user.setEnabled(true);
        }

        log.info("User email manually verified: userId={}", userId);
        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public User getRequiredUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id = " + userId));
    }

    private UserProfileResponse toUserProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getStatus(),
                user.isEnabled(),
                user.getAuthProvider(),
                user.isPasswordConfigured(),
                toRoleNames(user),
                user.getCreatedAt());
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getAddress(),
                user.getHostBio(),
                user.isEmailVerified(),
                user.getAuthProvider(),
                user.getStatus(),
                user.isEnabled(),
                user.getLockReason(),
                user.getLockedAt(),
                toRoleNames(user),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    private Set<String> toRoleNames(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .map(Enum::name)
                .sorted(Comparator.naturalOrder())
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
    }
}
