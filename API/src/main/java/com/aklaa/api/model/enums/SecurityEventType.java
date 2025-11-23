package com.aklaa.api.model.enums;

import lombok.Getter;

import java.time.Duration;

@Getter
public enum SecurityEventType {
    LOGIN(true),
    LOGOUT(true),
    FAILED_LOGIN(true, 5, Duration.ofDays(7)),
    /**
     * Password reset flow has been completed
     */
    PASSWORD_RESET(true),
    /**
     * Password reset flow has been started for the user
     */
    PASSWORD_FORGOT(true, 5, Duration.ofDays(7)),
    /**
     * The user tried to access a resource they do not have permissions for
     */
    UNAUTHORIZED_ACCESS(false);

    private final boolean defaultVerify;
    private final Integer requiredVerificationAfter;
    private final Duration requiredVerificationDuration;

    SecurityEventType(boolean defaultVerify) {
        this(defaultVerify, null, null);
    }

    SecurityEventType(boolean defaultVerify, Integer requiredVerificationAfter, Duration requiredVerificationDuration) {
        this.defaultVerify = defaultVerify;
        this.requiredVerificationAfter = requiredVerificationAfter;
        this.requiredVerificationDuration = requiredVerificationDuration;
    }
}
