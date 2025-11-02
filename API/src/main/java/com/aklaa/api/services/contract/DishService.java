package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.User;

public interface DishService {
    DishResponseDTO create(DishRequestDTO dishRequestDTO, User user);
    DishResponseDTO update(DishRequestDTO dishRequestDTO, Long id, User user);
}
