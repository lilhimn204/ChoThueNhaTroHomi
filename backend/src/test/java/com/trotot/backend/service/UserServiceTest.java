package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.trotot.backend.dto.user.ChangePasswordRequest;
import com.trotot.backend.dto.user.SetPasswordRequest;
import com.trotot.backend.entity.AuthProvider;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.repository.RoleRepository;
import com.trotot.backend.repository.UserRepository;
import com.trotot.backend.security.UserPrincipal;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService — password management")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("changeCurrentUserPassword updates password when current password is valid")
    void changeCurrentUserPassword_validCurrentPassword_updatesPassword() {
        User user = new User();
        user.setId(7L);
        user.setPasswordHash("old-hash");

        UserPrincipal principal = principal(7L);
        UserService userService = new UserService(userRepository, roleRepository, passwordEncoder);

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-password", "old-hash")).thenReturn(true);
        when(passwordEncoder.matches("new-password", "old-hash")).thenReturn(false);
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");

        userService.changeCurrentUserPassword(
                principal,
                new ChangePasswordRequest("old-password", "new-password"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("new-hash", captor.getValue().getPasswordHash());
    }

    @Test
    @DisplayName("changeCurrentUserPassword rejects wrong current password")
    void changeCurrentUserPassword_wrongCurrentPassword_throwsBusinessException() {
        User user = new User();
        user.setId(7L);
        user.setPasswordHash("old-hash");

        UserPrincipal principal = principal(7L);
        UserService userService = new UserService(userRepository, roleRepository, passwordEncoder);

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "old-hash")).thenReturn(false);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> userService.changeCurrentUserPassword(
                        principal,
                        new ChangePasswordRequest("wrong-password", "new-password")));

        assertEquals("Mật khẩu hiện tại không đúng.", exception.getMessage());
    }

    @Test
    @DisplayName("changeCurrentUserPassword rejects account without configured password")
    void changeCurrentUserPassword_withoutConfiguredPassword_throwsBusinessException() {
        User user = new User();
        user.setId(7L);
        user.setPasswordConfigured(false);
        user.setPasswordHash("opaque-hash");

        UserPrincipal principal = principal(7L);
        UserService userService = new UserService(userRepository, roleRepository, passwordEncoder);

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> userService.changeCurrentUserPassword(
                        principal,
                        new ChangePasswordRequest("old-password", "new-password")));

        assertEquals("Tài khoản chưa có mật khẩu. Vui lòng tạo mật khẩu trước.", exception.getMessage());
    }

    @Test
    @DisplayName("setCurrentUserPassword allows Google account without configured password")
    void setCurrentUserPassword_googleWithoutConfiguredPassword_setsPassword() {
        User user = new User();
        user.setId(7L);
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setPasswordConfigured(false);
        user.setPasswordHash("opaque-hash");

        UserPrincipal principal = principal(7L);
        UserService userService = new UserService(userRepository, roleRepository, passwordEncoder);

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");

        userService.setCurrentUserPassword(
                principal,
                new SetPasswordRequest("new-password", "new-password"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("new-hash", captor.getValue().getPasswordHash());
        assertEquals(true, captor.getValue().isPasswordConfigured());
    }

    private UserPrincipal principal(Long userId) {
        User user = new User();
        user.setId(userId);
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setPasswordHash("old-hash");
        user.setEnabled(true);
        return UserPrincipal.fromUser(user);
    }
}
