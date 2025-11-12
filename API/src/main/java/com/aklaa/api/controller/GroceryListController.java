package com.aklaa.api.controller;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dao.GroceryListRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.*;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.mapper.GroceryListMapper;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.User;
import com.aklaa.api.services.implementation.GroceryListServiceImpl;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grocerylists")
public class GroceryListController {

    private static final String CART_KEY = "cart";
    private final GroceryListRepository groceryListRepository;
    private final GroceryListServiceImpl  groceryListService;
    private final UserRepository userRepository;
    private final GroceryListMapper groceryListMapper;

    public GroceryListController(
            DishRepository dishRepository,
            GroceryListRepository groceryListRepository, GroceryListServiceImpl groceryListService,
            GroceryListMapper groceryListMapper,
            UserRepository userRepository,
            DishMapper dishMapper
    ) {
        this.groceryListRepository = groceryListRepository;
        this.groceryListService = groceryListService;
        this.groceryListMapper = groceryListMapper;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    @PostMapping("/save")
    public ResponseEntity<String> saveCart(@RequestParam LocalDateTime startOfWeek, @RequestParam LocalDateTime endOfWeek, HttpSession session, @AuthenticationPrincipal UserDetails userDetails) {
        List<CartDishRequestDTO> cartRequests = groceryListService.getCart(session);
        if (cartRequests.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        List<CartDishResponseDTO> cart = groceryListService.convertToResponseDTOs(cartRequests);
        if (cart.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        GroceryList groceryList = groceryListMapper.fromCartDishes(cart, optionalUser.get());
        groceryList.setStartOfWeek(startOfWeek);
        groceryList.setEndOfWeek(endOfWeek);
        groceryListRepository.save(groceryList);

        session.removeAttribute(CART_KEY);

        return ResponseEntity.ok().build();
    }

    @GetMapping()
    public ResponseEntity<List<GroceryListResponseDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        List<GroceryListResponseDTO> list = groceryListService.getGroceryLists(user, pageable);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/ingredients")
    public ResponseEntity<GroceryListIngredientListResponseDTO> getIngredientsOfGroceryList(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails, @PageableDefault(size = 10) Pageable pageable) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        GroceryListIngredientListResponseDTO ingredients =
                groceryListService.getIngredientOfGroceryList(id, optionalUser.get(), pageable);

        if (ingredients == null ||
                ingredients.getIngredients() == null ||
                ingredients.getIngredients().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(ingredients);
    }
}
