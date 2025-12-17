package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import java.time.LocalDateTime;

public class NewsDto {
    public record NewsResponse(Long id, String title, String body, String image_url, String author, LocalDateTime published_at) {}
    public record CreateNewsRequest(String title, String body, String image_url, String author) {}
}