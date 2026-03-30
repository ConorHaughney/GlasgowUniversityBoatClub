package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;

@Repository
public interface CommitteeRepository extends JpaRepository<CommitteeMember, Long> {
    Optional<CommitteeMember> findByRole(String role);
    Optional<CommitteeMember> findByEmailIgnoreCase(String email);
    List<CommitteeMember> findAllByOrderByOrderAsc();
}