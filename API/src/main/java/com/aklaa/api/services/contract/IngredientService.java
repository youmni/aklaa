package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;

public interface IngredientService {
    IngredientResponseDTO create(IngredientRequestDTO ingredientRequestDTO, User user);
    IngredientResponseDTO update(IngredientRequestDTO ingredientRequestDTO, Long id, User user);
}
