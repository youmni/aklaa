package com.aklaa.api.dao;

import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByActivationToken(String token);
    boolean existsByEmail(String email);

    List<User> findUsersByUserTypeIs(UserType userType);
}
