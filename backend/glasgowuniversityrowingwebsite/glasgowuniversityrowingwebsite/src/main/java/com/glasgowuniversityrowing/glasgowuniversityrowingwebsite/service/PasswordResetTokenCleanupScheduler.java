package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PasswordResetTokenCleanupScheduler {

    private final PasswordResetTokenService passwordResetTokenService;

    public PasswordResetTokenCleanupScheduler(PasswordResetTokenService passwordResetTokenService) {
        this.passwordResetTokenService = passwordResetTokenService;
    }

    @Scheduled(fixedDelayString = "${app.reset.cleanup.interval-ms:900000}")
    public void cleanupExpiredResetTokens() {
        passwordResetTokenService.cleanupExpiredTokens();
    }
}
