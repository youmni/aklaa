package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.response.SecurityEventDto;
import com.aklaa.api.model.SecurityEvent;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.SecurityEventType;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for managing and tracking security-related events within the application.
 * <p>
 * This service provides methods for recording various security events including authentication
 * attempts, password management operations, and unauthorized access attempts. It also supports
 * retrieval and verification of security events for audit and compliance purposes.
 * </p>
 */
public interface SecurityEventsService {

    /**
     * Retrieves a paginated list of security events that occurred after the specified timestamp.
     *
     * @param since the starting timestamp to filter events (events after this time are returned)
     * @param pageable pagination parameters including page number, size, and sorting options
     * @return a list of security event DTOs matching the criteria
     */
    List<SecurityEventDto> getEventsSince(LocalDateTime since, Pageable pageable);

    List<SecurityEventDto> getEventsSince(LocalDateTime since, SecurityEventType eventType, Pageable pageable);

    /**
     * Registers a new security event in the system.
     * <p>
     * This is the primary method for recording security events. All convenience methods
     * delegate to this method.
     * </p>
     *
     * @param user       the user who is the subject of the security event
     * @param actingUser the user who initiated the action (may be null for self-initiated actions)
     * @param type       the type of security event being recorded
     * @param message    a descriptive message providing context about the event
     */
    @Async
    void registerEvent(User user, User actingUser, SecurityEventType type, String message);

    /**
     * Marks a security event as verified or acknowledged.
     * <p>
     * This is typically used by administrators to acknowledge that they have reviewed
     * a security event.
     * </p>
     *
     * @param id the unique identifier of the security event to verify
     */
    void verifyEvent(long id);

    /**
     * Registers a security event for a user without specifying an acting user.
     * <p>
     * This is a convenience method that delegates to
     * {@link #registerEvent(User, User, SecurityEventType, String)} with a null acting user.
     * </p>
     *
     * @param user the user who is the subject of the security event
     * @param type the type of security event being recorded
     * @param message a descriptive message providing context about the event
     */
    @Async
    default void registerEvent(User user, SecurityEventType type, String message) {
        registerEvent(user, null, type, message);
    }

    /**
     * Registers a successful login event for the specified user.
     *
     * @param user the user who successfully logged in
     */
    @Async
    default void registerLogin(User user) {
        registerEvent(user, SecurityEventType.LOGIN, "Successful login");
    }

    /**
     * Registers a logout event for the currently authenticated user.
     * <p>
     * The current user is automatically retrieved from the {@link SecurityContextHolder}.
     * </p>
     */
    @Async
    default void registerLogout() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        registerEvent(user, SecurityEventType.LOGOUT, "Successful logout");
    }

    /**
     * Registers a failed login attempt for the specified user.
     *
     * @param user the user who attempted to log in
     * @param reason a description of why the login failed (e.g., "invalid password", "account locked")
     */
    @Async
    default void registerFailedLogin(User user, String reason) {
        registerEvent(user, SecurityEventType.FAILED_LOGIN, String.format("Failed to login: %s", reason));
    }

    /**
     * Registers a password reset flow request.
     *
     * @param user the user whose password reset was requested
     * @param actingUser the user who initiated the request (may be different for admin-initiated resets)
     */
    @Async
    default void registerPasswordForgot(User user, User actingUser) {
        registerEvent(user, actingUser, SecurityEventType.PASSWORD_FORGOT, "Password reset flow requested");
    }

    /**
     * Registers a password reset flow request for the currently authenticated user.
     * <p>
     * The current user is automatically retrieved from the {@link SecurityContextHolder}.
     * </p>
     *
     */
    @Async
    default void registerPasswordForgot() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        registerPasswordForgot(user, null);
    }

    /**
     * Registers a successful password reset event.
     *
     * @param user the user whose password was reset
     * @param actingUser the user who performed the reset (may be an administrator)
     */
    @Async
    default void registerPasswordReset(User user, User actingUser) {
        registerEvent(user, SecurityEventType.PASSWORD_RESET, "Password has been reset");
    }

    /**
     * Registers a password reset event for the currently authenticated user.
     * <p>
     * The current user is automatically retrieved from the {@link SecurityContextHolder}.
     * This is typically used for self-service password resets.
     * </p>
     */
    @Async
    default void registerPasswordReset() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        registerPasswordReset(user, null);
    }

    /**
     * Registers an unauthorized access attempt.
     *
     * @param user the user who attempted unauthorized access
     * @param resource the resource or endpoint that was accessed without permission
     */
    @Async
    default void registerUnauthorizedAccess(User user, String resource) {
        registerEvent(user, null, String.format("Attempted to access %s without permission", resource));
    }

}