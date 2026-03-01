package com.aklaa.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroceryListResponseDTO {
    private Long id;
    private OffsetDateTime startOfWeek;
    private OffsetDateTime endOfWeek;
}
