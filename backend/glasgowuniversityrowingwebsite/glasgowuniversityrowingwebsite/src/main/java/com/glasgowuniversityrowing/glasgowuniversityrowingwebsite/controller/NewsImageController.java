package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/news")
public class NewsImageController {

    private final StorageService storageService;

    public NewsImageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/image")
    @PreAuthorize("hasAuthority('NEWS_MANAGE')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = storageService.uploadNewsImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
        }
    }
}