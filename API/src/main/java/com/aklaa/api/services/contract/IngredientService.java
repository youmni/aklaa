package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for ingredient management operations.
 * <p>
 * This service handles CRUD operations for ingredients, including creation, updates,
 * deletion, filtering, and retrieval. All operations require an authenticated user
 * and enforce user-specific access control.
 * </p>
 *
 * @author Youmni Malha
 */
public interface IngredientService {
    
    /**
     * Creates a new ingredient in the system.
     * <p>
     * This method validates the ingredient data and associates it with the authenticated user.
     * The ingredient is persisted to the database with all its properties including name,
     * category, and nutritional information.
     * </p>
     *
     * @param ingredientRequestDTO the ingredient data containing name, category, etc.
     * @param user the authenticated user creating the ingredient
     * @return an {@link IngredientResponseDTO} containing the created ingredient details
     * @throws IllegalArgumentException if the ingredient data is invalid
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     * @throws com.aklaa.api.exceptions.IngredientAlreadyExistsException if an ingredient with the same name already exists
     */
    IngredientResponseDTO create(IngredientRequestDTO ingredientRequestDTO, User user);
    
    /**
     * Updates an existing ingredient.
     * <p>
     * This method updates the ingredient properties and verifies that the authenticated user
     * has permission to modify the ingredient (typically the ingredient owner).
     * </p>
     *
     * @param ingredientRequestDTO the updated ingredient data
     * @param id the ID of the ingredient to update
     * @param user the authenticated user performing the update
     * @return an {@link IngredientResponseDTO} containing the updated ingredient details
     * @throws IllegalArgumentException if the ingredient data is invalid
     * @throws com.aklaa.api.exceptions.IngredientNotFoundException if the ingredient with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to update this ingredient
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     */
    IngredientResponseDTO update(IngredientRequestDTO ingredientRequestDTO, Long id, User user);
    
    /**
     * Deletes an ingredient from the system.
     * <p>
     * This method removes the ingredient and verifies that the authenticated user
     * has permission to delete the ingredient (typically the ingredient owner).
     * </p>
     *
     * @param id the ID of the ingredient to delete
     * @param user the authenticated user performing the deletion
     * @return an {@link IngredientResponseDTO} containing the deleted ingredient details
     * @throws com.aklaa.api.exceptions.IngredientNotFoundException if the ingredient with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to delete this ingredient
     */
    IngredientResponseDTO delete(Long id, User user);
    
    /**
     * Filters and retrieves ingredients based on search criteria.
     * <p>
     * This method performs a paginated search for ingredients matching the provided criteria.
     * Results can be filtered by search term and ingredient categories.
     * </p>
     *
     * @param search the search term to match against ingredient names (can be null)
     * @param categories the list of categories to filter by (can be null or empty for all categories)
     * @param pageable the pagination information (page number, size, sorting)
     * @param user the authenticated user performing the search
     * @return an {@link IngredientListResponseDTO} containing the filtered ingredients and pagination metadata
     * @throws IllegalArgumentException if pagination parameters are invalid
     */
    IngredientListResponseDTO filter(String search, List<String> categories, Pageable pageable, User user);
    
    /**
     * Retrieves a specific ingredient by its ID.
     * <p>
     * This method fetches the complete ingredient details.
     * Access control may be enforced based on ingredient visibility settings.
     * </p>
     *
     * @param id the ID of the ingredient to retrieve
     * @param user the authenticated user requesting the ingredient
     * @return an {@link IngredientResponseDTO} containing the ingredient details
     * @throws com.aklaa.api.exceptions.IngredientNotFoundException if the ingredient with the specified ID does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to view this ingredient
     */
    IngredientResponseDTO get(Long id, User user);
    
    /**
     * Retrieves all ingredients in the system.
     * <p>
     * This method fetches all available ingredients without pagination.
     * Results may be filtered based on user permissions.
     * </p>
     *
     * @param user the authenticated user requesting all ingredients
     * @return a list of {@link IngredientResponseDTO} containing all ingredient details
     */
    List<IngredientResponseDTO> getAll(User user);
}