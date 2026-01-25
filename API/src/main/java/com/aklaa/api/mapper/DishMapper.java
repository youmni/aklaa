package com.aklaa.api.mapper;

import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.RecipeStepRequestDTO;
import com.aklaa.api.dtos.response.DishIngredientResponseInfoDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.RecipeStepResponseDTO;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import com.aklaa.api.model.RecipeStep;
import com.aklaa.api.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
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
                .imageUrl(dto.getImageUrl())
                .people(dto.getPeople())
                .user(user)
                .build();
    }

    public Dish toEntity(DishResponseDTO dto, User user) {
        return Dish.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .tags(dto.getTags())
                .type(dto.getType())
                .imageUrl(dto.getImageUrl())
                .people(dto.getPeople())
                .user(user)
                .build();
    }

    public void updateEntity(Dish dish, DishRequestDTO dto) {
        dish.setName(dto.getName());
        dish.setDescription(dto.getDescription());
        dish.setTags(dto.getTags());
        dish.setType(dto.getType());
        dish.setImageUrl(dto.getImageUrl());
        dish.setPeople(dto.getPeople());
    }

    public DishResponseDTO toResponseDTO(Dish dish) {
        return DishResponseDTO.builder()
                .id(dish.getId())
                .name(dish.getName())
                .description(dish.getDescription())
                .tags(dish.getTags())
                .type(dish.getType())
                .imageUrl(dish.getImageUrl())
                .people(dish.getPeople())
                .ingredients(
                        dish.getDishIngredients().stream()
                                .map(this::toDishIngredientResponseInfoDTO)
                                .collect(Collectors.toList())
                )
                .cookingSteps(
                        dish.getSteps().stream()
                                .map(this::toRecipeStepResponseDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }

    public List<RecipeStep> fromRequestDTOs(List<RecipeStepRequestDTO> steps, Dish dish) {
        if (steps == null) {
            return List.of();
        }

        return steps.stream()
                .map(dto -> RecipeStep.builder()
                        .recipeStep(dto.getStepText())
                        .orderIndex(dto.getOrderIndex())
                        .dish(dish)
                        .build()
                )
                .collect(Collectors.toList());
    }

    public List<RecipeStep> fromResponseDTOs(List<RecipeStepResponseDTO> steps, Dish dish) {
        if (steps == null) {
            return List.of();
        }

        return steps.stream()
                .map(dto -> RecipeStep.builder()
                        .recipeStep(dto.getRecipeStep())
                        .orderIndex(dto.getOrderIndex())
                        .dish(dish)
                        .build()
                )
                .collect(Collectors.toList());
    }

    private DishIngredientResponseInfoDTO toDishIngredientResponseInfoDTO(DishIngredient dishIngredient) {
        return DishIngredientResponseInfoDTO.builder()
                .ingredient(ingredientMapper.toResponseDTO(dishIngredient.getIngredient()))
                .quantity(dishIngredient.getQuantity())
                .build();
    }

    private RecipeStepResponseDTO toRecipeStepResponseDTO(RecipeStep recipeStep) {
        return RecipeStepResponseDTO.builder()
                .id(recipeStep.getId())
                .orderIndex(recipeStep.getOrderIndex())
                .recipeStep(recipeStep.getRecipeStep())
                .build();
    }
}
