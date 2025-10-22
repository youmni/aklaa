package com.aklaa.api.dao;

import com.aklaa.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByActivationToken(String token);
    boolean existsByEmail(String email);
}
