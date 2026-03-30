package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.UserRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.security.PermissionConstants;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public User createAdmin(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User admin = new User(email, passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        return userRepository.save(admin);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public void updatePassword(User user, String newRawPassword) {
        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }

    public User updatePermissionOverride(Long userId, boolean overrideEnabled, Set<String> permissions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!overrideEnabled) {
            user.setPermissionsOverrideEnabled(false);
            user.setPermissionSet(Set.of());
            return userRepository.save(user);
        }

        Set<String> requested = permissions == null ? Set.of() : new HashSet<>(permissions);
        boolean hasInvalidPermission = requested.stream().anyMatch(permission -> !PermissionConstants.ALL.contains(permission));

        if (hasInvalidPermission) {
            throw new RuntimeException("Invalid permission supplied");
        }

        user.setPermissionsOverrideEnabled(true);
        user.setPermissionSet(requested);
        return userRepository.save(user);
    }
}