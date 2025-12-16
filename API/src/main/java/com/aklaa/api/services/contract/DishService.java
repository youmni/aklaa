package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service interface for dish management operations.
 * <p>
 * This service provides functionality for creating, updating, deleting, 
 * retrieving, and filtering dishes with their associated ingredients.
 * </p>
 */
public interface DishService {
    
    /**
     * Creates a new dish with associated ingredients for the specified user.
     * <p>
     * This method creates a dish entity, validates and retrieves all ingredients by their IDs,
     * creates dish-ingredient associations with specified quantities, and saves the dish to the database.
     * </p>
     *
     * @param dishRequestDTO the dish data including name, description, cooking steps, ingredients, and metadata
     * @param user the user who is creating the dish
     * @return a {@link DishResponseDTO} containing the created dish with all its details
     * @throws NoSuchElementException if any ingredient ID in the request does not exist
     */
    DishResponseDTO create(DishRequestDTO dishRequestDTO, User user);
    
    /**
     * Updates an existing dish and its ingredients.
     * <p>
     * This method updates all dish properties, clears existing ingredient associations,
     * and recreates them based on the new ingredient list. Only the dish owner can update it.
     * </p>
     *
     * @param dishRequestDTO the updated dish data including name, description, cooking steps, and ingredients
     * @param id the ID of the dish to update
     * @param user the user requesting the update
     * @return a {@link DishResponseDTO} containing the updated dish with all its details
     * @throws NoSuchElementException if the dish or any ingredient ID is not found
     * @throws SecurityException if the user is not authorized to update this dish
     */
    DishResponseDTO update(DishRequestDTO dishRequestDTO, Long id, User user);
    
    /**
     * Deletes a dish from the database.
     * <p>
     * This method verifies that the requesting user owns the dish before deletion.
     * All associated dish-ingredient relationships are also removed.
     * </p>
     *
     * @param id the ID of the dish to delete
     * @param user the user requesting the deletion
     * @return a {@link DishResponseDTO} containing the deleted dish's data
     * @throws NoSuchElementException if the dish is not found
     * @throws AccessDeniedException if the user is not authorized to delete this dish
     */
    DishResponseDTO delete(Long id, User user);
    
    /**
     * Filters and retrieves dishes based on search criteria, cuisine types, and pagination.
     * <p>
     * This method searches across dish names, descriptions, tags, and ingredient names.
     * It filters by cuisine types if provided and returns paginated results for the authenticated user's dishes only.
     * </p>
     *
     * @param search the search term to filter dishes (searches in name, description, tags, and ingredient names)
     * @param countries the list of cuisine type names to filter by (e.g., "ITALIAN", "CHINESE")
     * @param pageable the pagination information including page number, size, and sorting
     * @param user the user whose dishes should be retrieved
     * @return a {@link DishListResponseDTO} containing the filtered dishes, total elements, and total pages
     */
    DishListResponseDTO filter(String search, List<String> countries, Pageable pageable, User user);
    /**
     * Get and retrieves dishes.
     * <p>
     * This method gets all dishes for the user that is passed.
     * </p>
     *
     * @param user the user whose dishes should be retrieved
     * @return a {@link DishListResponseDTO} containing the filtered dishes, total elements, and total pages
     */
    List<DishResponseDTO> getAll(User user);
    
    /**
     * Retrieves a specific dish by its ID.
     * <p>
     * This method verifies that the requesting user owns the dish before returning it.
     * </p>
     *
     * @param id the ID of the dish to retrieve
     * @param user the user requesting the dish
     * @return a {@link DishResponseDTO} containing the dish with all its details
     * @throws NoSuchElementException if the dish is not found
     * @throws SecurityException if the user is not authorized to view this dish
     */
    DishResponseDTO get(Long id, User user);
}