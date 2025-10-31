package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.model.Ingredient;

public interface IngredientService {
    Ingredient create(IngredientRequestDTO ingredientRequestDTO);
}
