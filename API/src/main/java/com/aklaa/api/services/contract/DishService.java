package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DishService {
    DishResponseDTO create(DishRequestDTO dishRequestDTO, User user);
    DishResponseDTO update(DishRequestDTO dishRequestDTO, Long id, User user);
    DishResponseDTO delete(Long id, User user);
    DishListResponseDTO filter(String search, List<String> countries, Pageable pageable, User user);
    DishResponseDTO get(Long id, User user);
}
