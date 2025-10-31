package com.aklaa.api.dtos.request;

import com.aklaa.api.model.enums.IngredientCategory;
import com.aklaa.api.model.enums.MeasurementUnit;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IngredientRequestDTO {
    @Column(nullable = false)
    @NotBlank(message = "Ingredient name is required")
    @Size(min = 1, max = 100, message = "Ingredient name must be between 1 and 100 characters")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Ingredient description is required")
    @Size(min = 1, max = 250, message = "Ingredient description must be between 1 and 250 characters")
    private String description;

    @Enumerated(EnumType.STRING)
    private IngredientCategory category;

    @Enumerated(EnumType.STRING)
    private MeasurementUnit unit;
}
