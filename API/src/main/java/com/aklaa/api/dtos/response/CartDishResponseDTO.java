package com.aklaa.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDishResponseDTO {
    private int id;
    private DishResponseDTO dish;
    private DayOfWeek dayOfWeek;
    private int people;
}