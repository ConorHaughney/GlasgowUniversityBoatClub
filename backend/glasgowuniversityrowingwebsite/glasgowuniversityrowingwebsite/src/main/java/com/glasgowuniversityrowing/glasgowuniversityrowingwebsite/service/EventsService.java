package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.EventsDto;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.Events;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.EventsRepository;

@Service
@Transactional
public class EventsService {

    private final EventsRepository repo;

    public EventsService(EventsRepository repo) {
        this.repo = repo;
    }

    public List<EventsDto> findAll() {
        return repo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<EventsDto> findById(Long id) {
        return repo.findById(id).map(this::toDto);
    }

    public EventsDto create(EventsDto dto) {
        Events e = fromDto(dto);
        e.setId(null);
        Events saved = repo.save(e);
        return toDto(saved);
    }

    public Optional<EventsDto> update(Long id, EventsDto dto) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(dto.getTitle());
            existing.setFeatured(dto.getFeatured());
            existing.setDescription(dto.getDescription());
            existing.setDate(parseDate(dto.getDate()));
            existing.setEndDate(parseDate(dto.getEndDate()));
            existing.setTime(parseTime(dto.getTime()));
            existing.setLocation(dto.getLocation());
            existing.setType(dto.getType());
            Events saved = repo.save(existing);
            return toDto(saved);
        });
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    private EventsDto toDto(Events e) {
        EventsDto d = new EventsDto();
        d.setId(e.getId());
        d.setTitle(e.getTitle());
        d.setFeatured(Boolean.TRUE.equals(e.getFeatured()));
        d.setDescription(e.getDescription());
        d.setDate(e.getDate() != null ? e.getDate().toString() : null);
        d.setEndDate(e.getEndDate() != null ? e.getEndDate().toString() : null);
        d.setTime(e.getTime() != null ? e.getTime().toString() : null);
        d.setLocation(e.getLocation());
        d.setType(e.getType());
        return d;
    }

    private Events fromDto(EventsDto d) {
        Events e = new Events();
        e.setTitle(d.getTitle());
        e.setFeatured(d.getFeatured() != null ? d.getFeatured() : Boolean.FALSE);
        e.setDescription(d.getDescription());
        e.setDate(parseDate(d.getDate()));
        e.setEndDate(parseDate(d.getEndDate()));
        e.setTime(parseTime(d.getTime()));
        e.setLocation(d.getLocation());
        e.setType(d.getType());
        return e;
    }

    private LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s);
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    private LocalTime parseTime(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalTime.parse(s);
        } catch (DateTimeParseException ex) {
            // attempt HH:mm
            try {
                return LocalTime.parse(s + ":00");
            } catch (DateTimeParseException ex2) {
                return null;
            }
        }
    }
}