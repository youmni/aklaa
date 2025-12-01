package com.aklaa.api.model;

import com.aklaa.api.model.enums.SecurityEventType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "security_events")
public class SecurityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user this event is about
     */
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    /**
     * Optionally, the user who has triggered the event. NULL if it's the same as user
     */
    @ManyToOne
    @JoinColumn(name="acting_user_id")
    private User actingUser;

    @Enumerated(EnumType.ORDINAL)
    @NotNull(message = "Event type is required")
    private SecurityEventType type;

    @Column
    private String message;

    /**
     * Might be true by default based on type
     */
    @Column
    private boolean verified;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
