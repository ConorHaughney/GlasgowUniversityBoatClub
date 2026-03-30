package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "ADMIN";

    @Column(name = "permissions_csv", length = 1000)
    private String permissionsCsv;

    @Column(name = "permissions_override_enabled", nullable = false)
    private boolean permissionsOverrideEnabled = false;

    // Constructor for creating a user
    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.role = "ADMIN";
    }

    // Default constructor
    public User() {
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

        getPermissionSet().forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission)));
        return List.copyOf(authorities);
    }

    public Set<String> getPermissionSet() {
        if (permissionsCsv == null || permissionsCsv.isBlank()) {
            return Set.of();
        }

        return List.of(permissionsCsv.split(",")).stream()
                .map(String::trim)
                .filter(permission -> !permission.isBlank())
                .collect(Collectors.toSet());
    }

    public void setPermissionSet(Set<String> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            this.permissionsCsv = null;
            return;
        }

        this.permissionsCsv = permissions.stream().sorted().collect(Collectors.joining(","));
    }

    @Override
    public String getUsername() {
        return email; // Use email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}