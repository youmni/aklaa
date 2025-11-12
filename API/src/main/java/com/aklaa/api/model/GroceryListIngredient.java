package com.aklaa.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class GroceryListIngredient {
    @EmbeddedId
    private GroceryListIngredientKey id;

    @ManyToOne
    @MapsId("groceryListId")
    @JoinColumn(name = "grocery_list_id")
    private GroceryList groceryList;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @NotNull(message = "Quantity is required")
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;
}
