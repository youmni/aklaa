package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IngredientService {
    IngredientResponseDTO create(IngredientRequestDTO ingredientRequestDTO, User user);
    IngredientResponseDTO update(IngredientRequestDTO ingredientRequestDTO, Long id, User user);
    IngredientResponseDTO delete(Long id, User user);
    IngredientListResponseDTO filter(String search, List<String> categories, Pageable pageable, User user);
}
