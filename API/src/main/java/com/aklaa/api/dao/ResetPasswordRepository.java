package com.aklaa.api.dao;

import com.aklaa.api.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetPasswordRepository extends JpaRepository<PasswordResetToken, Long> {}