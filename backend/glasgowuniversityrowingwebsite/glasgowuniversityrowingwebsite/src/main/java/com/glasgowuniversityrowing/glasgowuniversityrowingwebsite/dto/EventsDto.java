package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventsDto {

    private Long id;

    @NotBlank
    private String title;

    @NotNull
    private Boolean featured;

    private String description;

    // ISO date strings e.g. 2025-03-08
    private String date;

    private String endDate;

    // ISO time string e.g. 09:00:00 or 09:00
    private String time;

    private String location;

    private String type;

    public EventsDto() {}
}