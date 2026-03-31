package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.PasswordResetToken;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Transactional
    public PasswordResetToken createTokenForUser(User user) {
        passwordResetTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(generateTokenValue());
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusHours(1));

        return passwordResetTokenRepository.save(token);
    }

    public Optional<PasswordResetToken> findValidToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .filter(resetToken -> resetToken.getExpiresAt().isAfter(LocalDateTime.now()));
    }

    public boolean isTokenValid(String token) {
        return findValidToken(token).isPresent();
    }

    @Transactional
    public void invalidateToken(String token) {
        passwordResetTokenRepository.findByToken(token).ifPresent(passwordResetTokenRepository::delete);
    }

    @Transactional
    public void invalidateForUser(User user) {
        passwordResetTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }

    private String generateTokenValue() {
        return UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
    }
}
