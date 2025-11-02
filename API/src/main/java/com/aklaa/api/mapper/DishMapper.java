package com.aklaa.api.mapper;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.DishIngredientRequestInfoDTO;
import com.aklaa.api.dtos.response.DishIngredientResponseInfoDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import com.aklaa.api.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DishMapper {

    private final IngredientMapper ingredientMapper;

    public DishMapper(IngredientMapper ingredientMapper) {
        this.ingredientMapper = ingredientMapper;
    }

    public Dish toEntity(DishRequestDTO dto, User user) {
        return Dish.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .tags(dto.getTags())
                .type(dto.getType())
                .cookingSteps(dto.getCookingSteps())
                .imageUrl(dto.getImageUrl())
                .people(dto.getPeople())
                .user(user)
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
                                .map(this::toDishIngredientResponseInfoDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private DishIngredientResponseInfoDTO toDishIngredientResponseInfoDTO(DishIngredient dishIngredient) {
        return DishIngredientResponseInfoDTO.builder()
                .ingredient(ingredientMapper.toResponseDTO(dishIngredient.getIngredient()))
                .quantity(dishIngredient.getQuantity())
                .build();
    }
}
