package com.aklaa.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private OffsetDateTime expiresAt;

    @ManyToOne
    private User user;

    public boolean isExpired() {
        return expiresAt.isBefore(OffsetDateTime.now(ZoneOffset.UTC));
    }
}
