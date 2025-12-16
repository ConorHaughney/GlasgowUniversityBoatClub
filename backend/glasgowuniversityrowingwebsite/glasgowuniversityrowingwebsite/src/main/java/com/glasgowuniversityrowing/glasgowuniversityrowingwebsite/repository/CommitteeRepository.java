package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;

public interface CommitteeRepository extends JpaRepository<CommitteeMember, Long> {
    Optional<CommitteeMember> findByRole(String role);
    List<CommitteeMember> findAllByOrderByOrderAsc();
}