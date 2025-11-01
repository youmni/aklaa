package com.aklaa.api.mapper;

import com.aklaa.api.dtos.request.DishIngredientRequestDTO;
import com.aklaa.api.dtos.response.DishIngredientInfoDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DishMapper {
    public Dish toEntity(DishIngredientRequestDTO dto) {
        return Dish.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .tags(dto.getTags())
                .type(dto.getType())
                .cookingSteps(dto.getCookingSteps())
                .imageUrl(dto.getImageUrl())
                .people(dto.getPeople())
                .build();
    }

    public DishResponseDTO toResponseDTO(Dish dish) {
        return DishResponseDTO.builder()
                .id(dish.getId())
                .name(dish.getName())
                .description(dish.getDescription())
                .tags(dish.getTags())
                .type(dish.getType())
                .cookingSteps(dish.getCookingSteps())
                .imageUrl(dish.getImageUrl())
                .people(dish.getPeople())
                .ingredients(
                        dish.getDishIngredients().stream()
                                .map(this::toDishIngredientInfoDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private DishIngredientInfoDTO toDishIngredientInfoDTO(DishIngredient dishIngredient) {
        return DishIngredientInfoDTO.builder()
                .ingredient(
                        IngredientResponseDTO.builder()
                                .id(dishIngredient.getIngredient().getId())
                                .name(dishIngredient.getIngredient().getName())
                                .description(dishIngredient.getIngredient().getDescription())
                                .category(dishIngredient.getIngredient().getCategory())
                                .unit(dishIngredient.getIngredient().getUnit())
                                .build()
                )
                .quantity(dishIngredient.getQuantity())
                .build();
    }
}
