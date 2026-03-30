package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.LoginUserDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.UserRepository;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
        private final PermissionService permissionService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
                        PasswordEncoder passwordEncoder,
                        PermissionService permissionService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
                this.permissionService = permissionService;
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

                return permissionService.syncDefaultPermissions(user);
    }
}