package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for dish management operations.
 * <p>
 * This service handles CRUD operations for dishes, including creation, updates,
 * deletion, filtering, and retrieval. All operations require an authenticated user
 * and enforce user-specific access control.
 * </p>
 *
 * @author Youmni Malha
 */
public interface DishService {
    
    /**
     * Creates a new dish in the system.
     * <p>
     * This method validates the dish data and associates it with the authenticated user.
     * The dish is persisted to the database with all its properties and ingredients.
     * </p>
     *
     * @param dishRequestDTO the dish data containing name, description, ingredients, etc.
     * @param user the authenticated user creating the dish
     * @return a {@link DishResponseDTO} containing the created dish details
     * @throws IllegalArgumentException if the dish data is invalid
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     * @throws com.aklaa.api.exceptions.IngredientNotFoundException if any specified ingredient does not exist
     */
    DishResponseDTO create(DishRequestDTO dishRequestDTO, User user);
    
    /**
     * Updates an existing dish.
     * <p>
     * This method updates the dish properties and verifies that the authenticated user
     * has permission to modify the dish (typically the dish owner).
     * </p>
     *
     * @param dishRequestDTO the updated dish data
     * @param id the ID of the dish to update
     * @param user the authenticated user performing the update
     * @return a {@link DishResponseDTO} containing the updated dish details
     * @throws IllegalArgumentException if the dish data is invalid
     * @throws com.aklaa.api.exceptions.DishNotFoundException if the dish with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to update this dish
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     * @throws com.aklaa.api.exceptions.IngredientNotFoundException if any specified ingredient does not exist
     */
    DishResponseDTO update(DishRequestDTO dishRequestDTO, Long id, User user);
    
    /**
     * Deletes a dish from the system.
     * <p>
     * This method removes the dish and verifies that the authenticated user
     * has permission to delete the dish (typically the dish owner).
     * </p>
     *
     * @param id the ID of the dish to delete
     * @param user the authenticated user performing the deletion
     * @return a {@link DishResponseDTO} containing the deleted dish details
     * @throws com.aklaa.api.exceptions.DishNotFoundException if the dish with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to delete this dish
     */
    DishResponseDTO delete(Long id, User user);
    
    /**
     * Filters and retrieves dishes based on search criteria.
     * <p>
     * This method performs a paginated search for dishes matching the provided criteria.
     * Results can be filtered by search term and country of origin.
     * </p>
     *
     * @param search the search term to match against dish names or descriptions (can be null)
     * @param countries the list of countries to filter by (can be null or empty for all countries)
     * @param pageable the pagination information (page number, size, sorting)
     * @param user the authenticated user performing the search
     * @return a {@link DishListResponseDTO} containing the filtered dishes and pagination metadata
     * @throws IllegalArgumentException if pagination parameters are invalid
     */
    DishListResponseDTO filter(String search, List<String> countries, Pageable pageable, User user);
    
    /**
     * Retrieves a specific dish by its ID.
     * <p>
     * This method fetches the complete dish details including all ingredients.
     * Access control may be enforced based on dish visibility settings.
     * </p>
     *
     * @param id the ID of the dish to retrieve
     * @param user the authenticated user requesting the dish
     * @return a {@link DishResponseDTO} containing the dish details
     * @throws com.aklaa.api.exceptions.DishNotFoundException if the dish with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to view this dish
     */
    DishResponseDTO get(Long id, User user);
}