package com.trotot.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.common.MessageResponse;
import com.trotot.backend.dto.user.ChangePasswordRequest;
import com.trotot.backend.dto.user.SetPasswordRequest;
import com.trotot.backend.dto.user.UpdateUserProfileRequest;
import com.trotot.backend.dto.user.UserProfileResponse;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(principal));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        return ResponseEntity.ok(userService.updateCurrentUserProfile(principal, request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changeCurrentUserPassword(principal, request);
        return ResponseEntity.ok(new MessageResponse("Đã đổi mật khẩu thành công."));
    }

    @PutMapping("/me/password/setup")
    public ResponseEntity<MessageResponse> setPassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SetPasswordRequest request) {
        userService.setCurrentUserPassword(principal, request);
        return ResponseEntity.ok(new MessageResponse("Đã tạo mật khẩu cho tài khoản thành công."));
    }
}
