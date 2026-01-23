package com.aklaa.api.dtos.request;

import jakarta.validation.constraints.Min;
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
public class RecipeStepRequestDTO {
    @Min(value = 1, message = "Step order must be at least 1")
    private int orderIndex;

    @NotBlank(message = "Step text cannot be empty")
    @Size(max = 250, message = "Step description must not be longer than 250 characters")
    private String stepText;
}