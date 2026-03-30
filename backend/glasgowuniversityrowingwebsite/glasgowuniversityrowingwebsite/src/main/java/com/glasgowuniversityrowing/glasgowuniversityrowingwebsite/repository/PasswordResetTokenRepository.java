package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.PasswordResetToken;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;

@Repository
public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);

    void deleteByUser(User user);

    @Modifying
    @Transactional
    @Query("delete from PasswordResetToken t where t.expiresAt < :now")
    void deleteExpiredTokens(LocalDateTime now);
}
