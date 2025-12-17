package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.EventsDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.EventsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
public class EventsController {

    private final EventsService service;

    public EventsController(EventsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EventsDto>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventsDto> get(@PathVariable("eventId") Long eventId) {
        return service.findById(eventId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventsDto> create(@Valid @RequestBody EventsDto dto) {
        EventsDto created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/events/" + created.getId())).body(created);
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventsDto> update(@PathVariable("eventId") Long eventId, @Valid @RequestBody EventsDto dto) {
        return service.update(eventId, dto).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("eventId") Long eventId) {
        return service.delete(eventId) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}