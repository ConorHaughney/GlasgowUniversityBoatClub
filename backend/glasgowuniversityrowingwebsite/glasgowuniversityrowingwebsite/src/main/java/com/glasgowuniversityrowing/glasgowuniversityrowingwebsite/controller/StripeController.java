package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CheckoutDto.*;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        try {
            String clientSecret = stripeService.createCheckoutSession(request);
            return ResponseEntity.ok(new CheckoutResponse(clientSecret));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}