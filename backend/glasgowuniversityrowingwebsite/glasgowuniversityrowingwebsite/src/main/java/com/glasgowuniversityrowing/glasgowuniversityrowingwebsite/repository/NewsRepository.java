package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.News;

public interface NewsRepository extends JpaRepository<News, Long> {
    // additional query methods if needed
}