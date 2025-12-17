package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.NewsRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.News;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.NewsDto.*;

@Service
public class NewsService {

    private final NewsRepository repo;

    public NewsService(NewsRepository repo) {
        this.repo = repo;
    }

    public List<NewsResponse> listAll() {
        return repo.findAll().stream()
                .map(n -> new NewsResponse(n.getId(), n.getTitle(), n.getContent(), n.getImageUrl(), n.getAuthor(), n.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public NewsResponse getById(Long id) {
        return repo.findById(id)
                .map(n -> new NewsResponse(n.getId(), n.getTitle(), n.getContent(), n.getImageUrl(), n.getAuthor(), n.getCreatedAt()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found"));
    }

    public NewsResponse create(CreateNewsRequest req) {
        LocalDateTime now = LocalDateTime.now();
        News n = new News(req.title(), req.body(), req.image_url(), req.author(), now);
        News saved = repo.save(n);
        return new NewsResponse(saved.getId(), saved.getTitle(), saved.getContent(), saved.getImageUrl(), saved.getAuthor(), saved.getCreatedAt());
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found");
        }
        repo.deleteById(id);
    }
}