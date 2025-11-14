package com.aklaa.api.dtos.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroceryListIngredientListRequestDTO {
    @NotNull(message = "ingredientsWithQuantity is required.")
    @NotEmpty(message = "ingredientsWithQuantity cannot be empty.")
    private Map<
            @NotNull(message = "Ingredient ID cannot be null.")
            @Positive(message = "Ingredient ID must be a positive number.")
                    Long,
            @NotNull(message = "Quantity cannot be null.")
            @Positive(message = "Quantity must be greater than zero.")
                    BigDecimal
            > ingredientsWithQuantity;
}