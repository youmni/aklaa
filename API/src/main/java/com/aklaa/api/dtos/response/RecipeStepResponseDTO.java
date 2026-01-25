package com.aklaa.api.dtos.response;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecipeStepResponseDTO {
    private Long id;

    @Positive
    private int orderIndex;

    @Size(min= 5, max = 255, message = "The step must be between 5 and 255 characters")
    private String recipeStep;
}