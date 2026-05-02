package com.trotot.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.user.AdminUserResponse;
import com.trotot.backend.dto.user.UpdateUserRolesRequest;
import com.trotot.backend.dto.user.UpdateUserStatusRequest;
import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.UserStatus;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public PageResponse<AdminUserResponse> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) RoleName role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.searchUsers(keyword, status, role, page, size);
    }

    @GetMapping("/{userId}")
    public AdminUserResponse getUserDetail(@PathVariable Long userId) {
        return userService.getAdminUserDetail(userId);
    }

    @PatchMapping("/{userId}/status")
    public AdminUserResponse updateUserStatus(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        return userService.updateUserStatus(userId, request, principal.getId());
    }

    @PatchMapping("/{userId}/roles")
    public AdminUserResponse updateUserRoles(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateUserRolesRequest request) {
        return userService.updateUserRoles(userId, request, principal.getId());
    }

    @PatchMapping("/{userId}/verify-email")
    public AdminUserResponse verifyUserEmail(@PathVariable Long userId) {
        return userService.verifyUserEmail(userId);
    }
}
