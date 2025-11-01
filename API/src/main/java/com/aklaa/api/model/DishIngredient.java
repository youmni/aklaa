package com.aklaa.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class DishIngredient {

    @EmbeddedId
    private DishIngredientKey id;

    @ManyToOne
    @MapsId("dishId")
    @JoinColumn(name = "dish_id")
    private Dish dish;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @NotNull(message = "Quantity is required")
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;
}