package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
