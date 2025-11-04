package com.aklaa.api.mapper;

import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.DishIngredientRequestInfoDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.CartDishResponseDTO;
import com.aklaa.api.dtos.response.DishIngredientResponseInfoDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class IngredientMapper {

    private final IngredientRepository ingredientRepository;

    public IngredientMapper(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public IngredientRequestDTO toRequestDTO(Ingredient ingredient) {
        return IngredientRequestDTO.builder()
                .name(ingredient.getName())
                .description(ingredient.getDescription())
                .category(ingredient.getCategory())
                .unit(ingredient.getUnit())
                .build();
    }

    public IngredientResponseDTO toResponseDTO(Ingredient ingredient) {
        return IngredientResponseDTO.builder()
                .id(ingredient.getId())
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

    public List<DishIngredientResponseInfoDTO> scaleIngredients(CartDishResponseDTO cartDish) {
        List<DishIngredientResponseInfoDTO> scaledIngredients = new ArrayList<>();

        if (cartDish.getDish() == null || cartDish.getDish().getIngredients() == null)
            return scaledIngredients;

        int originalPeople = cartDish.getDish().getPeople();
        int newPeople = cartDish.getPeople();

        for (DishIngredientResponseInfoDTO ingDTO : cartDish.getDish().getIngredients()) {
            BigDecimal newQuantity = calculateScaledQuantity(
                    ingDTO.getQuantity(),
                    originalPeople,
                    newPeople
            );

            scaledIngredients.add(
                    DishIngredientResponseInfoDTO.builder()
                            .ingredient(ingDTO.getIngredient())
                            .quantity(newQuantity)
                            .build()
            );
        }
        return scaledIngredients;
    }

    public List<GroceryListIngredient> toGroceryListIngredients(
            GroceryList groceryList,
            List<DishIngredientResponseInfoDTO> ingredients
    ) {
        List<GroceryListIngredient> result = new ArrayList<>();

        for (DishIngredientResponseInfoDTO dto : ingredients) {

            Ingredient ingredient = ingredientRepository.findById(dto.getIngredient().getId())
                    .orElseThrow(() -> new IllegalStateException(
                            "Ingredient not found: " + dto.getIngredient().getId()
                    ));

            GroceryListIngredient entity = GroceryListIngredient.builder()
                    .id(new GroceryListIngredientKey(groceryList.getId(), ingredient.getId()))
                    .groceryList(groceryList)
                    .ingredient(ingredient)
                    .quantity(dto.getQuantity())
                    .build();

            result.add(entity);
        }

        return result;
    }

    private BigDecimal calculateScaledQuantity(BigDecimal baseQuantity, int originalPeople, int newPeople) {
        if (baseQuantity == null || originalPeople <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal ratio = BigDecimal.valueOf((double) newPeople / originalPeople);
        return baseQuantity.multiply(ratio).setScale(3, RoundingMode.HALF_UP);
    }
}
