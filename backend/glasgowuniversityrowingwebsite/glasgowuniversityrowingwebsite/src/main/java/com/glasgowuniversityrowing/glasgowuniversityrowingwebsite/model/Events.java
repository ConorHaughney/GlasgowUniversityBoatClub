package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String title;

    private Boolean featured = false;

    @Column(columnDefinition = "text")
    private String description;

    private LocalDate date;

    @Column(name = "end_date")
    private LocalDate endDate;

    private LocalTime time;

    private String location;

    @Column(name = "type")
    private String type;

    public Events() {}

    public Events(Long id, String title, Boolean featured, String description, LocalDate date, LocalDate endDate, LocalTime time, String location, String type) {
        this.id = id;
        this.title = title;
        this.featured = featured;
        this.description = description;
        this.date = date;
        this.endDate = endDate;
        this.time = time;
        this.location = location;
        this.type = type;
    }
}