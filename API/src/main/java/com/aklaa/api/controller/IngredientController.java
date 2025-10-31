package com.aklaa.api.controller;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.services.implementation.IngredientServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping(name = "/api/ingredients")
public class IngredientController {

    private final IngredientServiceImpl ingredientService;


    public IngredientController(IngredientServiceImpl ingredientService) {
        this.ingredientService = ingredientService;
    }

    @PostMapping
    public ResponseEntity<Ingredient> create(@RequestBody @Valid IngredientRequestDTO ingredientRequestDTO) {
        Ingredient ingredient = ingredientService.create(ingredientRequestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/ingredients/{id}")
                .buildAndExpand(ingredient.getId())
                .toUri();

        return ResponseEntity.created(location).body(ingredient);
    }
}
