package com.aklaa.api.mapper;

import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import com.aklaa.api.model.DishIngredientKey;
import com.aklaa.api.model.Ingredient;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DishIngredientMapper {
    public DishIngredient toEntity(Dish dish, Ingredient ingredient, BigDecimal quantity) {
        DishIngredientKey key = DishIngredientKey.builder()
                .dishId(dish.getId())
                .ingredientId(ingredient.getId())
                .build();

        return DishIngredient.builder()
                .id(key)
                .dish(dish)
                .ingredient(ingredient)
                .quantity(quantity)
                .build();
    }
}
