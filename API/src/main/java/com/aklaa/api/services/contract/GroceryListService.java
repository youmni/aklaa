package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.request.GroceryListIngredientListRequestDTO;
import com.aklaa.api.dtos.response.GroceryListIngredientListResponseDTO;
import com.aklaa.api.dtos.response.GroceryListResponseDTO;
import com.aklaa.api.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for grocery list management operations.
 * <p>
 * This service handles operations related to shopping carts and grocery lists,
 * including retrieving cart items, managing grocery lists, and updating ingredients
 * within a grocery list. It provides functionality for converting cart items into
 * organized grocery lists.
 * </p>
 *
 * @author Youmni Malha
 */
public interface GroceryListService {
    
    /**
     * Retrieves the current shopping cart from the user's session.
     * <p>
     * This method fetches all dishes that have been added to the cart during
     * the current session. The cart is stored in the HTTP session and persists
     * until the session expires or the user checks out.
     * </p>
     *
     * @param session the HTTP session containing the cart data
     * @return a list of {@link CartDishRequestDTO} representing the dishes in the cart
     */
    List<CartDishRequestDTO> getCart(HttpSession session);
    
    /**
     * Retrieves all grocery lists for the authenticated user.
     * <p>
     * This method fetches a paginated list of grocery lists created by the user.
     * Each grocery list contains aggregated ingredients from multiple dishes.
     * </p>
     *
     * @param user the authenticated user whose grocery lists to retrieve
     * @param pageable the pagination information (page number, size, sorting)
     * @return a list of {@link GroceryListResponseDTO} containing the user's grocery lists
     * @throws IllegalArgumentException if pagination parameters are invalid
     */
    List<GroceryListResponseDTO> getGroceryLists(User user, Pageable pageable);
    
    /**
     * Retrieves all ingredients from a specific grocery list.
     * <p>
     * This method fetches a paginated list of ingredients belonging to the specified
     * grocery list. It verifies that the authenticated user has permission to access
     * the grocery list.
     * </p>
     *
     * @param id the ID of the grocery list
     * @param user the authenticated user requesting the ingredients
     * @param pageable the pagination information (page number, size, sorting)
     * @return a {@link GroceryListIngredientListResponseDTO} containing the ingredients and pagination metadata
     * @throws com.aklaa.api.exceptions.GroceryListNotFoundException if the grocery list does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to access this grocery list
     * @throws IllegalArgumentException if pagination parameters are invalid
     */
    GroceryListIngredientListResponseDTO getIngredientOfGroceryList(Long id, User user, Pageable pageable);
    
    /**
     * Updates the ingredients in a specific grocery list.
     * <p>
     * This method updates the ingredient quantities or status (e.g., checked/unchecked)
     * in the grocery list. It verifies that the authenticated user has permission to
     * modify the grocery list.
     * </p>
     *
     * @param id the ID of the grocery list to update
     * @param list the updated ingredient list data
     * @param user the authenticated user performing the update
     * @throws com.aklaa.api.exceptions.GroceryListNotFoundException if the grocery list does not exist
     * @throws com.aklaa.api.exceptions.UnauthorizedException if the user is not authorized to update this grocery list
     * @throws IllegalArgumentException if the ingredient data is invalid
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     */
    void updateIngredientsOfGroceryList(Long id, GroceryListIngredientListRequestDTO list, User user);
}