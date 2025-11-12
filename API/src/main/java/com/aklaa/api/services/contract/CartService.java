package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.CartDishRequestDTO;

public interface CartService {
    void save(CartDishRequestDTO dish);
}
