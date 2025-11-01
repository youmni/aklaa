package com.aklaa.api.mapper;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.model.Ingredient;
import org.springframework.stereotype.Component;

@Component
public class IngredientMapper {
    public IngredientRequestDTO toRequestDTO(Ingredient ingredient) {
        return IngredientRequestDTO.builder()
                .name(ingredient.getName())
                .description(ingredient.getDescription())
                .category(ingredient.getCategory())
                .unit(ingredient.getUnit())
                .build();
    }

    public Ingredient toEntity(IngredientRequestDTO ingredientRequestDTO) {
        return Ingredient.builder()
                .name(ingredientRequestDTO.getName())
                .description(ingredientRequestDTO.getDescription())
                .category(ingredientRequestDTO.getCategory())
                .unit(ingredientRequestDTO.getUnit())
                .build();
    }
}
