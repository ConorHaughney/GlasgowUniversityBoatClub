package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.ForgotPasswordRequestDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.LoginUserDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.ResetPasswordRequestDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.PasswordResetToken;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.responses.LoginResponse;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.AuthenticationService;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.ForgotPasswordRateLimitService;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.JwtService;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.PasswordResetEmailService;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.PasswordResetTokenService;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.UserService;

import jakarta.validation.Valid;

@RequestMapping({"/auth", "/api/auth"})
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    private final UserService userService;

    private final PasswordResetTokenService passwordResetTokenService;

    private final PasswordResetEmailService passwordResetEmailService;

    private final ForgotPasswordRateLimitService forgotPasswordRateLimitService;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService,
            UserService userService,
            PasswordResetTokenService passwordResetTokenService,
            PasswordResetEmailService passwordResetEmailService,
            ForgotPasswordRateLimitService forgotPasswordRateLimitService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.passwordResetTokenService = passwordResetTokenService;
        this.passwordResetEmailService = passwordResetEmailService;
        this.forgotPasswordRateLimitService = forgotPasswordRateLimitService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(
                jwtToken,
                jwtService.getExpirationTime(),
                authenticatedUser.getRole(),
                authenticatedUser.getPermissionSet());
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verify() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto request) {
        forgotPasswordRateLimitService.checkRateLimit(request.getEmail());

        userService.findByEmail(request.getEmail()).ifPresent(user -> {
            PasswordResetToken token = passwordResetTokenService.createTokenForUser(user);
            passwordResetEmailService.sendPasswordResetEmail(user, token.getToken());
        });

        return ResponseEntity.ok(Map.of("message", "If an account exists with that email, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {
        PasswordResetToken token = passwordResetTokenService.findValidToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Invalid or expired reset link"));

        User user = token.getUser();
        userService.updatePassword(user, request.getPassword());
        passwordResetTokenService.invalidateToken(request.getToken());
        passwordResetEmailService.sendPasswordResetConfirmationEmail(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    @GetMapping("/validate-token/{token}")
    public ResponseEntity<Map<String, Boolean>> validateResetToken(@PathVariable String token) {
        return ResponseEntity.ok(Map.of("valid", passwordResetTokenService.isTokenValid(token)));
    }

    @PostMapping("/reset-password/admin/{userId}")
    @PreAuthorize("hasAuthority('RESET_LINKS_ADMIN')")
    public ResponseEntity<Map<String, String>> adminSendResetLink(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "User not found"));

        PasswordResetToken token = passwordResetTokenService.createTokenForUser(user);
        passwordResetEmailService.sendPasswordResetEmail(user, token.getToken());

        return ResponseEntity.ok(Map.of("message", "Reset link sent"));
    }

}