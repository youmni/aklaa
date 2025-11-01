package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;

public interface IngredientService {
    Ingredient create(IngredientRequestDTO ingredientRequestDTO, User user);
}
