package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

public class NewsDto {
    public record NewsResponse(Long id, String title, String body, String image_url, String author, LocalDateTime published_at) {}
    public record CreateNewsRequest(@NotBlank(message = "Title is required") String title, String body, String image_url, String author, LocalDate published_at) {}
}