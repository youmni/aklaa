package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.model.enums.UserType;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for user management operations.
 * <p>
 * This service provides functionality for retrieving, filtering, and updating users,
 * as well as refreshing authentication contexts.
 * </p>
 */
public interface UserService {
    
    /**
     * Retrieves and filters users based on search criteria, user type, and pagination.
     * <p>
     * This method searches across user first names, last names, and email addresses.
     * It filters by user type if provided and returns paginated results.
     * </p>
     *
     * @param search the search term to filter users (searches in firstName, lastName, and email)
     * @param type the user type name to filter by (e.g., "ADMIN", "USER")
     * @param pageable the pagination information including page number, size, and sorting
     * @return a {@link UserListResponseDTO} containing the filtered users, total elements, and total pages
     */
    UserListResponseDTO getUsers(String search, String type, Pageable pageable);
    
    /**
     * Retrieves a specific user by their ID.
     * <p>
     * This method fetches the user details from the database.
     * </p>
     *
     * @param id the ID of the user to retrieve
     * @return a {@link UserDTO} containing the user's data
     * @throws NoSuchElementException if the user is not found
     */
    UserDTO get(Long id);
    
    /**
     * Updates a user's role/type.
     * <p>
     * This method updates the user's type in the database and refreshes the
     * security authentication context to reflect the new role immediately.
     * </p>
     *
     * @param id the ID of the user whose role should be updated
     * @param userType the new user type to assign
     * @return a {@link UserDTO} containing the updated user's data
     * @throws NoSuchElementException if the user is not found
     */
    UserDTO updateUserRole(Long id, UserType userType);
    
    /**
     * Refreshes the authentication context for a user.
     * <p>
     * This method reloads the user details from the database and updates
     * the Spring Security context with the fresh user information and authorities.
     * This is typically called after updating user roles to ensure the changes
     * are reflected in the current security context.
     * </p>
     *
     * @param email the email address of the user whose authentication should be refreshed
     */
    void refreshAuthentication(String email);
}