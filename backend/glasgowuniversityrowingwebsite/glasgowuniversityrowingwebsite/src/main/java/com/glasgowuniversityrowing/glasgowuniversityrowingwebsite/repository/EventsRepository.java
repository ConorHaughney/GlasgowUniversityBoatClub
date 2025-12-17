package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.Events;

@Repository
public interface EventsRepository extends JpaRepository<Events, Long> {
    // additional query methods can be added here
}