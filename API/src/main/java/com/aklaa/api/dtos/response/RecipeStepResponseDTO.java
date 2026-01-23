package com.aklaa.api.dtos.response;

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
    private int orderIndex;
    private String recipeStep;
}