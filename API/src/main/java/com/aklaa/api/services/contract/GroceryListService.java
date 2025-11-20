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
 * Service interface for grocery list and shopping cart management operations.
 * <p>
 * This service provides functionality for managing shopping carts in sessions,
 * retrieving grocery lists, and managing ingredients within grocery lists.
 * </p>
 */
public interface GroceryListService {
    
    /**
     * Retrieves the shopping cart from the HTTP session.
     * <p>
     * This method fetches the cart stored in the session under the "cart" attribute.
     * If the cart doesn't exist or is invalid, a new empty cart is created and stored in the session.
     * </p>
     *
     * @param session the HTTP session containing the shopping cart
     * @return a list of {@link CartDishRequestDTO} representing the dishes in the cart
     */
    List<CartDishRequestDTO> getCart(HttpSession session);
    
    /**
     * Retrieves all grocery lists for a specific user with pagination.
     * <p>
     * This method fetches grocery lists belonging to the user, sorted and paginated
     * according to the provided pageable parameters.
     * </p>
     *
     * @param user the user whose grocery lists should be retrieved
     * @param pageable the pagination information including page number, size, and sorting
     * @return a list of {@link GroceryListResponseDTO} containing the user's grocery lists
     */
    List<GroceryListResponseDTO> getGroceryLists(User user, Pageable pageable);
    
    /**
     * Retrieves the ingredients of a specific grocery list with pagination.
     * <p>
     * This method fetches all ingredients in a grocery list, sorted by category and name,
     * and returns them in a paginated format. If the grocery list is not found or doesn't
     * belong to the user, an empty response is returned.
     * </p>
     *
     * @param id the ID of the grocery list
     * @param user the user who owns the grocery list
     * @param pageable the pagination information including page number, size, and sorting
     * @return a {@link GroceryListIngredientListResponseDTO} containing the paginated ingredients,
     *         total elements, and total pages
     */
    GroceryListIngredientListResponseDTO getIngredientOfGroceryList(Long id, User user, Pageable pageable);
    
    /**
     * Updates the ingredients in a specific grocery list.
     * <p>
     * This method updates ingredient quantities, removes ingredients not in the update list,
     * and adds new ingredients. Existing ingredients have their quantities updated,
     * while ingredients not in the request are removed from the list.
     * </p>
     *
     * @param id the ID of the grocery list to update
     * @param list the request DTO containing the updated ingredient quantities
     * @param user the user who owns the grocery list
     */
    void updateIngredientsOfGroceryList(Long id, GroceryListIngredientListRequestDTO list, User user);
}