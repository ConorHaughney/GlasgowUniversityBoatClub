package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import java.util.List;

public class CheckoutDto {
    public record CheckoutItem(String name, String size, int quantity) {}
    public record CheckoutRequest(List<CheckoutItem> items) {}
    public record CheckoutResponse(String clientSecret) {}
}