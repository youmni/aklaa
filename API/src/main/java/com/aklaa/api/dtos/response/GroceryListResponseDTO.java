package com.aklaa.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroceryListResponseDTO {
    private Long id;
    private LocalDateTime startOfWeek;
    private LocalDateTime endOfWeek;
}
