package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.MerchItem;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.MerchItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merch")
public class MerchItemController {

    private final MerchItemRepository repo;

    public MerchItemController(MerchItemRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<MerchItem> getAll() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public MerchItem create(@RequestBody MerchItem item) {
        return repo.save(item);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public ResponseEntity<MerchItem> update(@PathVariable Long id, @RequestBody MerchItem item) {
        return repo.findById(id)
            .map(existing -> {
                existing.setName(item.getName());
                existing.setPrice(item.getPrice());
                existing.setImageUrl(item.getImageUrl());
                existing.setDescription(item.getDescription());
                return ResponseEntity.ok(repo.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}