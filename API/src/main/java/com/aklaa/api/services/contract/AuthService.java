package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.LoginDTO;
import com.aklaa.api.dtos.request.PasswordResetRequestDTO;
import com.aklaa.api.dtos.request.RegistrationDTO;
import com.aklaa.api.dtos.response.AuthResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Service interface for authentication and user management operations.
 * <p>
 * This service provides functionality for user registration, login, 
 * password reset, and token management.
 * </p>
 */
public interface AuthService {
    
    /**
     * Registers a new user in the system.
     * <p>
     * This method validates that passwords match, creates a new user 
     * with an encoded password, generates an activation token, and sends an 
     * activation email to the user.
     * </p>
     *
     * @param registrationDTO the registration data including email, password, and confirmation
     * @return a {@link UserDTO} containing the registered user's data
     * @throws IllegalArgumentException if the passwords do not match
     */
    UserDTO register(RegistrationDTO registrationDTO);
    
    /**
     * Authenticates a user and generates JWT tokens.
     * <p>
     * This method validates the login credentials, checks if the account is activated,
     * and generates both an access token and refresh token upon successful authentication.
     * </p>
     *
     * @param loginDTO the login credentials with email and password
     * @return an {@link AuthResponseDTO} with success status, message, access token, and refresh token
     * @throws InvalidCredentialsException if the email or password is incorrect
     * @throws AccountNotActivatedException if the account has not been activated yet
     * @throws JOSEException if an error occurs during JWT token generation
     */
    AuthResponseDTO login(LoginDTO loginDTO) throws JOSEException;
    
    /**
     * Processes a password reset request.
     * <p>
     * This method generates a password reset token with a 15-minute expiration time,
     * saves it to the database, and sends a reset email to the user.
     * If the user does not exist, the request is silently ignored for security purposes.
     * </p>
     *
     * @param passwordResetRequestDTO the request containing the user's email address
     */
    void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO);
    
    /**
     * Refreshes an expired access token using a valid refresh token.
     * <p>
     * This method validates the refresh token, checks the token type,
     * and generates a new access token for the user.
     * </p>
     *
     * @param refreshToken the refresh token to use for generating a new access token
     * @return an {@link AuthResponseDTO} with the new access token and the same refresh token
     * @throws IllegalArgumentException if the refresh token is null, invalid, expired, 
     *         has the wrong type, or if the user is not found
     */
    AuthResponseDTO refreshAccessToken(String refreshToken);
    
    /**
     * Retrieves the value of a specific cookie from an HTTP request.
     * <p>
     * This utility method searches through all cookies in the request and returns 
     * the value of the cookie with the given name.
     * </p>
     *
     * @param request the HTTP servlet request object containing the cookies
     * @param name the name of the cookie whose value should be retrieved
     * @return the value of the cookie, or {@code null} if the cookie is not found
     *         or if no cookies are present in the request
     */
    String getCookieValue(HttpServletRequest request, String name);
}