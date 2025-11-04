package com.aklaa.api.mapper;

import com.aklaa.api.dtos.response.CartDishResponseDTO;
import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.GroceryListIngredient;
import com.aklaa.api.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GroceryListMapper {
    private final IngredientMapper ingredientMapper;

    public GroceryListMapper(IngredientMapper ingredientMapper) {
        this.ingredientMapper = ingredientMapper;
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

}
