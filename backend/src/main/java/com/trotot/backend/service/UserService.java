package com.trotot.backend.service;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.user.AdminUserResponse;
import com.trotot.backend.dto.user.ChangePasswordRequest;
import com.trotot.backend.dto.user.UpdateUserProfileRequest;
import com.trotot.backend.dto.user.UpdateUserStatusRequest;
import com.trotot.backend.dto.user.UserProfileResponse;
import com.trotot.backend.entity.Role;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
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

    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> searchUsers(String keyword, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        var users = userRepository.searchUsers(InputSanitizer.trimToNull(keyword), pageable);
        return PageResponse.from(users, this::toAdminUserResponse);
    }

    @Transactional
    public AdminUserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = getRequiredUserEntity(userId);
        user.setStatus(request.status());
        user.setEnabled(request.enabled() == null ? user.isEnabled() : request.enabled());
        log.info("User status updated: userId={}, status={}, enabled={}", userId, user.getStatus(), user.isEnabled());
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
                toRoleNames(user),
                user.getCreatedAt());
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus(),
                user.isEnabled(),
                toRoleNames(user),
                user.getCreatedAt());
    }

    private Set<String> toRoleNames(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .map(Enum::name)
                .sorted(Comparator.naturalOrder())
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
    }
}
