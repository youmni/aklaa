package com.aklaa.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class DishIngredientKey implements Serializable {
    @Column(name = "dish_id")
    Long dishId;

    @Column(name = "ingredient_id")
    Long ingredientId;
}
