package com.aklaa.api.dao;

import com.aklaa.api.model.EmailResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface ResetEmailRepository extends JpaRepository<EmailResetToken, Long> {
    Optional<EmailResetToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM EmailResetToken t WHERE t.expiresAt < :date")
    void deleteEmailResetTokenAutomatically(@Param("date") OffsetDateTime date);
}