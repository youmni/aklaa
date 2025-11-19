package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.LoginDTO;
import com.aklaa.api.dtos.request.PasswordResetRequestDTO;
import com.aklaa.api.dtos.request.RegistrationDTO;
import com.aklaa.api.dtos.response.AuthResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;

/**
 * Service interface for authentication and user management operations.
 * <p>
 * This service handles user registration, login, and password reset functionality.
 * All methods validate input according to the constraints defined in the DTO classes.
 * </p>
 *
 * @author Youmni Malha
 */
public interface AuthService {
    
    /**
     * Registers a new user in the system.
     * <p>
     * This method validates the registration data, hashes the password,
     * and persists the new user to the database. Upon successful registration,
     * a verification email is sent to the user.
     * </p>
     *
     * @param registrationDTO the registration data containing user information
     *                        (email, password, name, etc.)
     * @return a {@link UserDTO} containing the registered user's details
     * @throws IllegalArgumentException if the registration data is invalid
     * @throws com.aklaa.api.exceptions.UserAlreadyExistsException if the email address is already in use
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     */
    UserDTO register(RegistrationDTO registrationDTO);
    
    /**
     * Authenticates a user and generates authentication tokens.
     * <p>
     * This method verifies the login credentials, generates a JWT token
     * upon successful authentication, and returns user information.
     * </p>
     *
     * @param loginDTO the login credentials containing email and password
     * @return an {@link AuthResponseDTO} containing JWT token and user information
     * @throws com.aklaa.api.exceptions.InvalidCredentialsException if the credentials are incorrect
     * @throws IllegalArgumentException if the login data is invalid
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     */
    AuthResponseDTO login(LoginDTO loginDTO);
    
    /**
     * Processes a password reset request for a user.
     * <p>
     * This method generates a unique reset token, stores it in the database,
     * and sends an email with a reset link to the provided email address.
     * The reset token is valid for a limited time period.
     * </p>
     *
     * @param passwordResetRequestDTO the password reset request containing the email address
     * @throws com.aklaa.api.exceptions.UserNotFoundException if the user is not found
     * @throws IllegalArgumentException if the request data is invalid
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     * @throws com.aklaa.api.exceptions.EmailException if sending the email fails
     */
    void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO);
}