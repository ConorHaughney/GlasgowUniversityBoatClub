package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ForgotPasswordRateLimitService {

    private final Map<String, Deque<Instant>> attemptsByEmail = new ConcurrentHashMap<>();
    private final int maxAttempts;
    private final Duration window;

    public ForgotPasswordRateLimitService(
            @Value("${app.reset.rate-limit.max:3}") int maxAttempts,
            @Value("${app.reset.rate-limit.window-minutes:60}") long windowMinutes) {
        this.maxAttempts = maxAttempts;
        this.window = Duration.ofMinutes(windowMinutes);
    }

    public void checkRateLimit(String email) {
        String key = email.toLowerCase();
        Instant now = Instant.now();

        Deque<Instant> attempts = attemptsByEmail.computeIfAbsent(key, ignored -> new ArrayDeque<>());

        synchronized (attempts) {
            Instant cutoff = now.minus(window);
            while (!attempts.isEmpty() && attempts.peekFirst().isBefore(cutoff)) {
                attempts.pollFirst();
            }

            if (attempts.size() >= maxAttempts) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Too many password reset attempts. Please try again later.");
            }

            attempts.addLast(now);
        }

        cleanupIfEmpty(key, attempts);
    }

    private void cleanupIfEmpty(String key, Deque<Instant> attempts) {
        if (attempts.isEmpty()) {
            attemptsByEmail.remove(key, attempts);
        }
    }
}
