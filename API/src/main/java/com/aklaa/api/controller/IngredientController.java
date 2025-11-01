package com.aklaa.api.controller;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.services.implementation.IngredientServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientServiceImpl ingredientService;
    private final UserRepository userRepository;

    public IngredientController(IngredientServiceImpl ingredientService, UserRepository userRepository) {
        this.ingredientService = ingredientService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Ingredient> create(@RequestBody @Valid IngredientRequestDTO ingredientRequestDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        Ingredient ingredient = ingredientService.create(ingredientRequestDTO, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/ingredients/{id}")
                .buildAndExpand(ingredient.getId())
                .toUri();

        return ResponseEntity.created(location).body(ingredient);
    }
}
