package com.aklaa.api.dtos.response;

import com.aklaa.api.dtos.shared.DishIngredientInfoDTO;
import com.aklaa.api.model.enums.CuisineType;
import com.aklaa.api.model.enums.DishTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DishResponseDTO {
    private Long id;
    private String name;
    private String description;
    private List<DishTag> tags;
    private CuisineType type;
    private String cookingSteps;
    private String imageUrl;
    private int people;
    private List<DishIngredientInfoDTO> ingredients;
}