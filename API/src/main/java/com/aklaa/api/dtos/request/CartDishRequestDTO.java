package com.aklaa.api.dtos.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDishRequestDTO {
    private int id;
    private Long dishId;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Weekday is required")
    private DayOfWeek dayOfWeek;

    @Min(value = 1, message = "People must be at least 1")
    @Max(value = 100, message = "People cannot exceed 100")
    private int people;
}
