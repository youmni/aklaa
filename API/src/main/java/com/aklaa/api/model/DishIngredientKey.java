package com.aklaa.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class DishIngredientKey {
    @Column(name = "dish_id")
    Long dishId;

    @Column(name = "ingredient_id")
    Long ingredientId;
}
