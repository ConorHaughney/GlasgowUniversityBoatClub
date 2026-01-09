package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.MerchItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MerchItemRepository extends JpaRepository<MerchItem, Long> {
    Optional<MerchItem> findByName(String name);
}