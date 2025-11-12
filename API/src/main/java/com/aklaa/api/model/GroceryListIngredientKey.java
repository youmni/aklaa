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
public class GroceryListIngredientKey implements Serializable {
    @Column(name = "grocery_list_id")
    Long groceryListId;

    @Column(name = "ingredient_id")
    Long ingredientId;
}
