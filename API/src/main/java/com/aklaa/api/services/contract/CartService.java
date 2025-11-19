package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.CartDishRequestDTO;

/**
 * Service interface for shopping cart operations.
 * <p>
 * This service handles adding dishes to a user's shopping cart.
 * The cart functionality allows users to collect dishes before proceeding to checkout.
 * </p>
 *
 * @author Youmni Malha
 */
public interface CartService {
    
    /**
     * Adds a dish to the user's shopping cart.
     * <p>
     * This method saves the specified dish with its quantity to the authenticated user's cart.
     * If the dish already exists in the cart, the quantity may be updated based on implementation.
     * </p>
     *
     * @param dish the cart dish request containing dish ID and quantity information
     * @throws IllegalArgumentException if the dish data is invalid
     * @throws com.aklaa.api.exceptions.DishNotFoundException if the specified dish does not exist
     * @throws jakarta.validation.ConstraintViolationException if validation constraints are not met
     * @throws com.aklaa.api.exceptions.UnauthorizedException if no user is authenticated
     */
    void save(CartDishRequestDTO dish);
}