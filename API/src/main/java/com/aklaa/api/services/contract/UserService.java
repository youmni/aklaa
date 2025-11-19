package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.model.enums.UserType;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for user management operations.
 * <p>
 * This service handles user-related operations including retrieval, filtering,
 * role management, and authentication refresh. It provides administrative
 * functionality for managing users in the system.
 * </p>
 *
 * @author Youmni Malha
 */
public interface UserService {
    
    /**
     * Retrieves a paginated and filtered list of users.
     * <p>
     * This method fetches users based on search criteria and user type filter.
     * Results are paginated according to the provided pagination parameters.
     * </p>
     *
     * @param search the search term to match against user names or emails (can be null)
     * @param type the user type to filter by (e.g., "ADMIN", "USER") (can be null for all types)
     * @param pageable the pagination information (page number, size, sorting)
     * @return a {@link UserListResponseDTO} containing the filtered users and pagination metadata
     * @throws IllegalArgumentException if pagination parameters are invalid
     */
    UserListResponseDTO getUsers(String search, String type, Pageable pageable);
    
    /**
     * Retrieves a specific user by their ID.
     * <p>
     * This method fetches the complete user details for the specified user ID.
     * </p>
     *
     * @param id the ID of the user to retrieve
     * @return a {@link UserDTO} containing the user details
     * @throws com.aklaa.api.exceptions.UserNotFoundException if the user with the specified ID does not exist
     */
    UserDTO get(Long id);
    
    /**
     * Updates the role of a specific user.
     * <p>
     * This method changes the user type (role) of the specified user.
     * This operation is typically restricted to administrators.
     * </p>
     *
     * @param id the ID of the user whose role to update
     * @param userType the new user type to assign
     * @return a {@link UserDTO} containing the updated user details
     * @throws com.aklaa.api.exceptions.UserNotFoundException if the user with the specified ID does not exist
     * @throws IllegalArgumentException if the user type is invalid
     */
    UserDTO updateUserRole(Long id, UserType userType);
    
    /**
     * Refreshes the authentication context for a user.
     * <p>
     * This method updates the security context with the latest user information
     * from the database. This is useful after user details have been modified
     * to ensure the authentication token reflects the current state.
     * </p>
     *
     * @param email the email address of the user whose authentication to refresh
     * @throws com.aklaa.api.exceptions.UserNotFoundException if the user with the specified email does not exist
     */
    void refreshAuthentication(String email);
}