package com.aklaa.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DishListResponseDTO {
    private List<DishResponseDTO> dishes;
    private long totalElements;
    private int totalPages;
}
