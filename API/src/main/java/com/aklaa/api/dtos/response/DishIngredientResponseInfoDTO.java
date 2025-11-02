package com.aklaa.api.dtos.response;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishIngredientResponseInfoDTO {
    @NotNull(message = "Ingredient is required")
    private IngredientResponseDTO ingredient;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.001", message = "Quantity must be at least 0.001")
    @DecimalMax(value = "1000000", message = "Quantity must not exceed 1000000")
    private BigDecimal quantity;
}