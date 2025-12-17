package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.NewsDto.*;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.NewsService;

@RestController
@RequestMapping("/api")
public class NewsController {

    private final NewsService service;

    public NewsController(NewsService service) {
        this.service = service;
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsResponse>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping("/admin/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> create(@RequestBody CreateNewsRequest req) {
        NewsResponse created = service.create(req);
        return ResponseEntity.status(201).body(created);
    }

    @DeleteMapping("/admin/news/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}