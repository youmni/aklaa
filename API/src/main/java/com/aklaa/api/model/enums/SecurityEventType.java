package com.aklaa.api.model.enums;

import lombok.Getter;

import java.time.Duration;

@Getter
public enum SecurityEventType {
    LOGIN,
    LOGOUT,
    FAILED_LOGIN(5, Duration.ofHours(1)),
    /**
     * Password reset flow has been completed
     */
    PASSWORD_RESET,
    /**
     * Password reset flow has been started for the user
     */
    PASSWORD_FORGOT(5, Duration.ofHours(1)),
    /**
     * The user tried to access a resource they do not have permissions for
     */
    UNAUTHORIZED_ACCESS(5, Duration.ofHours(1));

    private final Integer requiredVerificationAfter;
    private final Duration requiredVerificationDuration;

    SecurityEventType() {
        this(null, null);
    }

    SecurityEventType(Integer requiredVerificationAfter, Duration requiredVerificationDuration) {
        this.requiredVerificationAfter = requiredVerificationAfter;
        this.requiredVerificationDuration = requiredVerificationDuration;
    }
}
