package com.aklaa.api.mapper;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.CartDishResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.GroceryListResponseDTO;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.GroceryListIngredient;
import com.aklaa.api.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GroceryListMapper {
    private final IngredientMapper ingredientMapper;
    private final DishMapper dishMapper;
    private final DishRepository dishRepository;

    public GroceryListResponseDTO toResponseDTO(GroceryList groceryList) {
        return GroceryListResponseDTO.builder()
                .id(groceryList.getId())
                .startOfWeek(groceryList.getStartOfWeek())
                .endOfWeek(groceryList.getEndOfWeek())
                .build();
    }

    public GroceryList fromCartDishes(List<CartDishResponseDTO> cartDishes, User user) {
        GroceryList groceryList = GroceryList.builder()
                .startOfWeek(LocalDateTime.now())
                .endOfWeek(LocalDateTime.now().plusDays(7))
                .user(user)
                .build();

        Map<Long, GroceryListIngredient> mergedIngredients = new HashMap<>();

        for (CartDishResponseDTO cartDish : cartDishes) {
            List<GroceryListIngredient> ingredientsForDish =
                    ingredientMapper.toGroceryListIngredients(
                            groceryList,
                            ingredientMapper.scaleIngredients(cartDish)
                    );

            for (GroceryListIngredient gli : ingredientsForDish) {
                Long ingredientId = gli.getIngredient().getId();

                if (mergedIngredients.containsKey(ingredientId)) {
                    GroceryListIngredient existing = mergedIngredients.get(ingredientId);
                    existing.setQuantity(existing.getQuantity().add(gli.getQuantity()));
                } else {
                    mergedIngredients.put(ingredientId, gli);
                }
            }
        }

        groceryList.setGroceryListIngredients(new ArrayList<>(mergedIngredients.values()));
        return groceryList;
    }

    public List<CartDishResponseDTO> convertToCartDishResponseDTOs(List<CartDishRequestDTO> cartRequests) {
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
