package com.aklaa.api.dao;

import com.aklaa.api.model.SecurityEvent;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;

public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long>, JpaSpecificationExecutor<SecurityEvent> {

    long countByUserAndCreatedAtAfter(User user, LocalDateTime createdAtAfter);

    @EntityGraph(attributePaths = {"user", "actingUser"})
    List<SecurityEvent> getAllByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime createdAtAfter, Pageable pageable);
}
