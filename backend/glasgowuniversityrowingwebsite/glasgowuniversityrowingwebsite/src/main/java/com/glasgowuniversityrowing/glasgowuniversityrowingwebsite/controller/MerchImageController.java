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
@RequestMapping("/api/admin/merch")
public class MerchImageController {

    private final StorageService storageService;

    public MerchImageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/image")
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = storageService.uploadMerchImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
        }
    }
}