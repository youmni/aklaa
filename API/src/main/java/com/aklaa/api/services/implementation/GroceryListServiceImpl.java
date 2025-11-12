package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.response.CartDishResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.model.Dish;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroceryListServiceImpl {

    private final DishRepository dishRepository;
    private final DishMapper dishMapper;

    public GroceryListServiceImpl(DishRepository dishRepository, DishMapper dishMapper) {
        this.dishRepository = dishRepository;
        this.dishMapper = dishMapper;
    }

    public List<CartDishRequestDTO> getCart(HttpSession session) {
        String CART_KEY = "cart";
        Object sessionCart = session.getAttribute(CART_KEY);
        if (sessionCart instanceof List<?> rawList) {
            boolean valid = rawList.stream().allMatch(CartDishRequestDTO.class::isInstance);
            if (valid) {
                return (List<CartDishRequestDTO>) rawList;
            }
        }
        List<CartDishRequestDTO> newCart = new ArrayList<>();
        session.setAttribute(CART_KEY, newCart);
        return newCart;
    }

    public List<CartDishResponseDTO> convertToResponseDTOs(List<CartDishRequestDTO> cartRequests) {
        return cartRequests.stream()
                .map(req -> {
                    Optional<Dish> dishOpt = dishRepository.findById(req.getDishId());
                    if (dishOpt.isEmpty()) return null;

                    DishResponseDTO dishDTO = dishMapper.toResponseDTO(dishOpt.get());
                    return CartDishResponseDTO.builder()
                            .id(req.getId())
                            .dish(dishDTO)
                            .dayOfWeek(req.getDayOfWeek())
                            .people(req.getPeople())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
