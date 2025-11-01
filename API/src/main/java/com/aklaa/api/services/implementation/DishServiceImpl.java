package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.shared.DishIngredientInfoDTO;
import com.aklaa.api.mapper.DishIngredientMapper;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.DishService;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final DishMapper dishMapper;
    private final DishIngredientMapper dishIngredientMapper;
    private final IngredientRepository ingredientRepository;

    public DishServiceImpl(DishRepository dishRepository, DishMapper dishMapper, DishIngredientMapper dishIngredientMapper, IngredientRepository ingredientRepository) {
        this.dishRepository = dishRepository;
        this.dishMapper = dishMapper;
        this.dishIngredientMapper = dishIngredientMapper;
        this.ingredientRepository = ingredientRepository;
    }

    @Override
    public DishResponseDTO create(DishRequestDTO dishRequestDTO, User user) {
        Dish dish = dishMapper.toEntity(dishRequestDTO, user);
        dish = dishRepository.save(dish);

        for (DishIngredientInfoDTO ingredientInfo : dishRequestDTO.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ingredientInfo.getIngredientId())
                    .orElseThrow(() -> new NoSuchElementException("Ingredient not found with id: " + ingredientInfo.getIngredientId()));

            DishIngredient dishIngredient = dishIngredientMapper.toEntity(dish, ingredient, ingredientInfo.getQuantity());
            dishIngredient.setDish(dish);
            dishIngredient.setIngredient(ingredient);

            dish.getDishIngredients().add(dishIngredient);
        }
        dish = dishRepository.save(dish);

        return dishMapper.toResponseDTO(dish);
    }
}
