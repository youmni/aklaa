package com.aklaa.api.services.contract;

import com.aklaa.api.model.User;
import jakarta.mail.MessagingException;

import java.io.IOException;

/**
 * Service interface for email operations.
 * <p>
 * This service handles sending various types of emails to users, including
 * account activation emails and password reset emails. Email templates are
 * loaded from the resources/templates directory and populated with user-specific data.
 * </p>
 *
 * @author Youmni Malha
 */
public interface EmailService {
    
    /**
     * Sends an account activation email to a newly registered user.
     * <p>
     * This method loads the registration email template, populates it with the user's
     * information and activation token, and sends it to the user's email address.
     * The activation link allows the user to verify their email address.
     * </p>
     *
     * @param user the user to send the activation email to
     * @param token the unique activation token for email verification
     * @throws IOException if the email template cannot be read or processed
     * @throws MessagingException if the email cannot be sent due to mail server issues
     */
    void sendActivationEmail(User user, String token) throws IOException, MessagingException;
    
    /**
     * Sends a password reset email to a user who requested to reset their password.
     * <p>
     * This method loads the password reset email template, populates it with the user's
     * information and reset token, and sends it to the user's email address.
     * The reset link allows the user to create a new password.
     * </p>
     *
     * @param user the user to send the password reset email to
     * @param token the unique reset token for password reset verification
     * @throws IOException if the email template cannot be read or processed
     * @throws MessagingException if the email cannot be sent due to mail server issues
     */
    void sendPasswordResetEmail(User user, String token) throws IOException, MessagingException;
}