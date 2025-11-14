package com.aklaa.api.dtos.response;

import com.aklaa.api.model.enums.IngredientCategory;
import com.aklaa.api.model.enums.MeasurementUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IngredientResponseDTO {
    private Long id;
    private String name;
    private String description;
    private IngredientCategory category;
    private MeasurementUnit unit;
}