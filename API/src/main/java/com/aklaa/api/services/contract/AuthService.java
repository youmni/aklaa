package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.LoginDTO;
import com.aklaa.api.dtos.request.PasswordResetRequestDTO;
import com.aklaa.api.dtos.request.RegistrationDTO;
import com.aklaa.api.dtos.response.AuthResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

/**
 * Service interface for authentication and user account management operations.
 * Provides methods for user registration with email activation, login with JWT token generation,
 * and password reset functionality.
 */
public interface AuthService {
    
    /**
     * Registers a new user in the system and sends an account activation email.
     * <p>
     * The registration process includes:
     * <ul>
     *   <li>Validation of user input (email format, password strength, etc.)</li>
     *   <li>Password hashing using BCrypt</li>
     *   <li>Generation of activation token</li>
     *   <li>Sending activation email to the provided email address</li>
     *   <li>User account created with enabled=false (requires email activation)</li>
     * </ul>
     *
     * @param registrationDTO the registration data containing firstName, lastName, email, and password
     * @return UserDTO containing the registered user's details (without password)
     * @throws IllegalArgumentException if email already exists or validation fails
     */
    UserDTO register(RegistrationDTO registrationDTO);
    
    /**
     * Authenticates a user and generates JWT access and refresh tokens.
     * <p>
     * The login process includes:
     * <ul>
     *   <li>Verification of user credentials (email and password)</li>
     *   <li>Check if user account is activated (enabled=true)</li>
     *   <li>Generation of JWT access token (valid for 10 minutes)</li>
     *   <li>Generation of JWT refresh token (valid for 7 days, stored in HTTP-only cookie)</li>
     * </ul>
     *
     * @param loginDTO the login credentials containing email and password
     * @return AuthResponseDTO containing success status, message, and JWT access token
     * @throws RuntimeException if credentials are invalid or account is not activated
     */
    AuthResponseDTO login(LoginDTO loginDTO);
    
    /**
     * Processes a password reset request by generating a reset token and sending a reset email.
     * <p>
     * The password reset process includes:
     * <ul>
     *   <li>Validation of user existence based on provided email</li>
     *   <li>Generation of secure password reset token</li>
     *   <li>Sending password reset email with reset link</li>
     *   <li>Token stored in database with expiration time</li>
     * </ul>
     *
     * @param passwordResetRequestDTO the password reset request containing user email
     * @throws RuntimeException if user with provided email is not found
     */
    void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO);
    AuthResponseDTO refreshAccessToken(String refreshToken) throws ParseException, JOSEException;
    String getCookieValue(HttpServletRequest request, String name);
}
