package com.aklaa.api.services.contract;

import com.aklaa.api.exceptions.EmailSendingException;
import com.aklaa.api.model.User;

/**
 * Service interface for email operations.
 * <p>
 * This service provides functionality for sending various types of emails
 * such as account activation and password reset emails.
 * </p>
 */
public interface EmailService {
    
    /**
     * Sends an account activation email to the user.
     * <p>
     * This method loads an HTML email template, replaces the activation link placeholder
     * with the actual activation URL (frontend URL + token), and sends the email to the user's
     * email address. The activation link allows the user to activate their account.
     * </p>
     *
     * @param user the user to send the activation email to
     * @param token the unique activation token to be included in the activation link
     * @throws EmailSendingException if an error occurs while reading the template or sending the email
     */
    void sendActivationEmail(User user, String token);
    
    /**
     * Sends a password reset email to the user.
     * <p>
     * This method loads an HTML email template, replaces the password reset link placeholder
     * with the actual reset URL (frontend URL + token), and sends the email to the user's
     * email address. The reset link allows the user to reset their password.
     * </p>
     *
     * @param user the user to send the password reset email to
     * @param token the unique password reset token to be included in the reset link
     * @throws EmailSendingException if an error occurs while reading the template or sending the email
     */
    void sendPasswordResetEmail(User user, String token);
}