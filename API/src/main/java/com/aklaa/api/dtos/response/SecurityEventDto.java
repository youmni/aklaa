package com.aklaa.api.dtos.response;

import com.aklaa.api.model.SecurityEvent;
import com.aklaa.api.model.enums.SecurityEventType;
import jakarta.annotation.Nullable;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SecurityEventDto {

    private Long id;

    /**
     * The user this event is about
     */
    private UserDTO user;

    /**
     * Optionally, the user who has triggered the event. NULL if it's the same as user
     */
    @Nullable
    private UserDTO actingUser;

    private SecurityEventType type;

    private String message;

    /**
     * Might be true by default based on type
     */
    private boolean verified;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static SecurityEventDto build(SecurityEvent event) {
        return builder()
                .id(event.getId())
                .user(UserDTO.build(event.getUser()))
                .actingUser(UserDTO.build(event.getActingUser()))
                .type(event.getType())
                .message(event.getMessage())
                .verified(event.isVerified())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

}
