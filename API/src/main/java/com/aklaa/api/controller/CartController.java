package com.aklaa.api.controller;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.model.Dish;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final String CART_KEY = "cart";
    private final DishRepository dishRepository;

    public CartController(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    private List<CartDishRequestDTO> getCart(HttpSession session) {
        Object sessionCart = session.getAttribute(CART_KEY);
        if (sessionCart instanceof List<?> rawList) {
            boolean valid = rawList.stream().allMatch(CartDishRequestDTO.class::isInstance);
            if (valid) {
                return (List<CartDishRequestDTO>) rawList;
            }
        }
        List<CartDishRequestDTO> newCart = new ArrayList<>();
        session.setAttribute(CART_KEY, newCart);
        return newCart;
    }

    private void saveCart(HttpSession session, List<CartDishRequestDTO> cart) {
        session.setAttribute(CART_KEY, cart);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @GetMapping
    public ResponseEntity<List<CartDishRequestDTO>> getCartItems(HttpSession session) {
        return ResponseEntity.ok(getCart(session));
    }


    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@Valid @RequestBody CartDishRequestDTO newItem, HttpSession session) {
        Optional<Dish> dish = dishRepository.findById(newItem.getDishId());
        if(dish.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartDishRequestDTO> cart = getCart(session);
        int generatedId = cart.stream()
                .mapToInt(CartDishRequestDTO::getId)
                .max()
                .orElse(0) + 1;

        newItem.setId(generatedId);
        cart.add(newItem);

        saveCart(session, cart);

        return ResponseEntity.ok("Item added successfully");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editCartItem(@PathVariable int id, @Valid @RequestBody CartDishRequestDTO updatedItem, HttpSession session) {
        Optional<Dish> dish = dishRepository.findById(updatedItem.getDishId());
        if(dish.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CartDishRequestDTO> cart = getCart(session);

        Optional<CartDishRequestDTO> existingOpt = cart.stream()
                .filter(item -> item.getId() == id)
                .findFirst();

        if (existingOpt.isPresent()) {
            CartDishRequestDTO existing = existingOpt.get();
            existing.setDishId(updatedItem.getDishId());
            existing.setDayOfWeek(updatedItem.getDayOfWeek());
            existing.setPeople(updatedItem.getPeople());
            saveCart(session, cart);
            return ResponseEntity.ok("Item edited successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCartItem(@PathVariable int id, HttpSession session) {
        List<CartDishRequestDTO> cart = getCart(session);
        boolean removed = cart.removeIf(item -> item.getId() == id);

        if (removed) {
            saveCart(session, cart);
            return ResponseEntity.ok("Item delted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(HttpSession session) {
        session.removeAttribute(CART_KEY);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
