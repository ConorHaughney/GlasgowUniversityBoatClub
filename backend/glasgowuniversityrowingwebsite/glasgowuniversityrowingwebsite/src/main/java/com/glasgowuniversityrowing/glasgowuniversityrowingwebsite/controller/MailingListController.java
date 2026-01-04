package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.MailingListRequest;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.MailingListService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/mailing-list")
public class MailingListController {

    private final MailingListService mailingListService;
    
    // Store request counts: IP Address -> RateLimitStatus
    private final Map<String, RateLimitStatus> rateLimiters = new ConcurrentHashMap<>();

    public MailingListController(MailingListService mailingListService) {
        this.mailingListService = mailingListService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody MailingListRequest request, HttpServletRequest servletRequest) {
        String clientIp = getClientIp(servletRequest);

        if (isRateLimited(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Please try again later.");
        }

        try {
            mailingListService.subscribe(request);
            return ResponseEntity.ok("Subscribed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private boolean isRateLimited(String ip) {
        RateLimitStatus status = rateLimiters.computeIfAbsent(ip, k -> new RateLimitStatus());
        synchronized (status) {
            long now = System.currentTimeMillis();
            // Reset count if 1 hour has passed
            if (now - status.startTime > 3600000) {
                status.startTime = now;
                status.count = 0;
            }
            // Limit to 5 requests per hour
            if (status.count >= 5) {
                return true;
            }
            status.count++;
            return false;
        }
    }

    private static class RateLimitStatus {
        long startTime = System.currentTimeMillis();
        int count = 0;
    }
}