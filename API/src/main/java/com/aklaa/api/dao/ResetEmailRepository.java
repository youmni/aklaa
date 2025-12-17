package com.aklaa.api.dao;

import com.aklaa.api.model.EmailResetToken;
import com.aklaa.api.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResetEmailRepository extends JpaRepository<EmailResetToken, Long> {
    Optional<EmailResetToken> findByToken(String token);
}
