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
 * This service provides functionality for creating, updating, deleting, 
 * retrieving, and filtering ingredients.
 * </p>
 */
public interface IngredientService {
    
    /**
     * Creates a new ingredient for the specified user.
     * <p>
     * This method creates an ingredient entity with the provided data and associates it
     * with the user, then saves it to the database.
     * </p>
     *
     * @param ingredientRequestDTO the ingredient data including name, description, category, and unit
     * @param user the user who is creating the ingredient
     * @return an {@link IngredientResponseDTO} containing the created ingredient's data
     */
    IngredientResponseDTO create(IngredientRequestDTO ingredientRequestDTO, User user);
    
    /**
     * Updates an existing ingredient.
     * <p>
     * This method updates all ingredient properties with the new values provided.
     * Only the ingredient owner can update it.
     * </p>
     *
     * @param ingredientRequestDTO the updated ingredient data including name, description, category, and unit
     * @param id the ID of the ingredient to update
     * @param user the user requesting the update
     * @return an {@link IngredientResponseDTO} containing the updated ingredient's data
     * @throws NoSuchElementException if the ingredient is not found
     * @throws AccessDeniedException if the user is not authorized to update this ingredient
     */
    IngredientResponseDTO update(IngredientRequestDTO ingredientRequestDTO, Long id, User user);
    
    /**
     * Deletes an ingredient from the database.
     * <p>
     * This method verifies that the requesting user owns the ingredient before deletion.
     * </p>
     *
     * @param id the ID of the ingredient to delete
     * @param user the user requesting the deletion
     * @return an {@link IngredientResponseDTO} containing the deleted ingredient's data
     * @throws NoSuchElementException if the ingredient is not found
     * @throws AccessDeniedException if the user is not authorized to delete this ingredient
     */
    IngredientResponseDTO delete(Long id, User user);
    
    /**
     * Filters and retrieves ingredients based on search criteria, categories, and pagination.
     * <p>
     * This method searches across ingredient names and descriptions.
     * It filters by ingredient categories if provided and returns paginated results for the authenticated user's ingredients only.
     * </p>
     *
     * @param search the search term to filter ingredients (searches in name and description)
     * @param categories the list of ingredient category names to filter by (e.g., "VEGETABLE", "MEAT")
     * @param pageable the pagination information including page number, size, and sorting
     * @param user the user whose ingredients should be retrieved
     * @return an {@link IngredientListResponseDTO} containing the filtered ingredients, total elements, and total pages
     */
    IngredientListResponseDTO filter(String search, List<String> categories, Pageable pageable, User user);
    
    /**
     * Retrieves a specific ingredient by its ID.
     * <p>
     * This method verifies that the requesting user owns the ingredient before returning it.
     * </p>
     *
     * @param id the ID of the ingredient to retrieve
     * @param user the user requesting the ingredient
     * @return an {@link IngredientResponseDTO} containing the ingredient's data
     * @throws NoSuchElementException if the ingredient is not found
     * @throws AccessDeniedException if the user is not authorized to view this ingredient
     */
    IngredientResponseDTO get(Long id, User user);
    
    /**
     * Retrieves all ingredients for a specific user.
     * <p>
     * This method fetches all ingredients belonging to the user and returns them
     * sorted by category and then by name.
     * </p>
     *
     * @param user the user whose ingredients should be retrieved
     * @return a list of {@link IngredientResponseDTO} containing all the user's ingredients
     */
    List<IngredientResponseDTO> getAll(User user);
}