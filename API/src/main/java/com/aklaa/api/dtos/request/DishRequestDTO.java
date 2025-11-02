package com.aklaa.api.dtos.request;

import com.aklaa.api.model.enums.CuisineType;
import com.aklaa.api.model.enums.DishTag;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishRequestDTO {
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tags list cannot be null")
    private List<DishTag> tags;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Cuisine type is required")
    private CuisineType type;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String cookingSteps;

    @NotBlank(message = "Image URL is required")
    @Size(max = 255, message = "Image URL must be shorter than 255 characters")
    @Pattern(
            regexp = "^(https?://|/).+",
            message = "Image URL must be a valid URL or path"
    )
    private String imageUrl;

    @Min(value = 1, message = "People must be at least 1")
    @Max(value = 100, message = "People cannot exceed 100")
    private int people;

    @NotNull(message = "Ingredients cannot be null")
    @NotEmpty(message = "At least one ingredient is required")
    @Valid
    private List<@Valid DishIngredientRequestInfoDTO> ingredients;
}
