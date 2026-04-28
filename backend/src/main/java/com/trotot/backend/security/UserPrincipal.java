package com.trotot.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.trotot.backend.entity.Role;
import com.trotot.backend.entity.User;
import com.trotot.backend.entity.UserStatus;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String passwordHash;
    private final boolean enabled;
    private final UserStatus status;
    private final List<GrantedAuthority> authorities;

    private UserPrincipal(
            Long id,
            String fullName,
            String email,
            String passwordHash,
            boolean enabled,
            UserStatus status,
            List<GrantedAuthority> authorities) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.enabled = enabled;
        this.status = status;
        this.authorities = authorities;
    }

    public static UserPrincipal fromUser(User user) {
        List<GrantedAuthority> authorities = user.getRoles()
                .stream()
                .map(Role::getName)
                .map(Enum::name)
                .map(role -> "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .map(GrantedAuthority.class::cast)
                .toList();

        return new UserPrincipal(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.isEnabled(),
                user.getStatus(),
                authorities);
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.LOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled && status == UserStatus.ACTIVE;
    }
}
