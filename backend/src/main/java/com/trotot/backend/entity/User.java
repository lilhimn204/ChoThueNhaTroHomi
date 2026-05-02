package com.trotot.backend.entity;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 20)
    private String phone;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(length = 255)
    private String address;

    @Column(name = "host_bio", length = 500)
    private String hostBio;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "google_id", unique = true, length = 120)
    private String googleId;

    @Column(name = "otp_hash", length = 255)
    private String otpHash;

    @Column(name = "otp_expires_at")
    private Instant otpExpiresAt;

    @Column(name = "otp_attempts", nullable = false)
    private int otpAttempts = 0;

    @Column(name = "otp_resend_count", nullable = false)
    private int otpResendCount = 0;

    @Column(name = "otp_last_sent_at")
    private Instant otpLastSentAt;

    @Column(name = "password_reset_otp_hash", length = 255)
    private String passwordResetOtpHash;

    @Column(name = "password_reset_otp_expires_at")
    private Instant passwordResetOtpExpiresAt;

    @Column(name = "password_reset_otp_attempts", nullable = false)
    private int passwordResetOtpAttempts = 0;

    @Column(name = "password_reset_otp_resend_count", nullable = false)
    private int passwordResetOtpResendCount = 0;

    @Column(name = "password_reset_otp_last_sent_at")
    private Instant passwordResetOtpLastSentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "lock_reason", length = 300)
    private String lockReason;

    @Column(name = "locked_at")
    private Instant lockedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public boolean hasRole(RoleName roleName) {
        return roles.stream().anyMatch(role -> role.getName() == roleName);
    }
}
