package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.GroceryListRepository;
import com.aklaa.api.dtos.response.GroceryListIngredientResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.GroceryListIngredient;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExportUserDataServiceImpl implements ExportUserDataService {

    private final UserService userService;
    private final DishService dishService;
    private final IngredientService ingredientService;
    private final GroceryListRepository groceryListRepository;
    private final ObjectMapper objectMapper;

    @Override
    public byte[] getUserData(User user) throws JsonProcessingException {
        List<GroceryList> groceryLists = groceryListRepository.findByUserWithIngredients(user);
        
        List<Map<String, Object>> groceryListsWithIngredients = groceryLists.stream()
                .map(groceryList -> {
                    Map<String, Object> groceryListMap = new HashMap<>();
                    groceryListMap.put("groceryList", Map.of(
                            "id", groceryList.getId(),
                            "startOfWeek", groceryList.getStartOfWeek(),
                            "endOfWeek", groceryList.getEndOfWeek()
                    ));
                    
                    List<GroceryListIngredientResponseDTO> ingredients = groceryList.getGroceryListIngredients()
                            .stream()
                            .sorted(
                                    Comparator.comparing(
                                            (GroceryListIngredient item) ->
                                                    item.getIngredient().getCategory()
                                    ).thenComparing(
                                            item -> item.getIngredient().getName()
                                    )
                            )
                            .map(item -> GroceryListIngredientResponseDTO.builder()
                                    .ingredient(IngredientResponseDTO.builder()
                                            .id(item.getIngredient().getId())
                                            .name(item.getIngredient().getName())
                                            .description(item.getIngredient().getDescription())
                                            .category(item.getIngredient().getCategory())
                                            .unit(item.getIngredient().getUnit())
                                            .build())
                                    .quantity(item.getQuantity())
                                    .build()
                            )
                            .toList();
                    
                    groceryListMap.put("ingredients", ingredients);
                    return groceryListMap;
                })
                .toList();

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("user", userService.get(user.getId()));
        map.put("ingredients", ingredientService.getAll(user));
        map.put("dishes", dishService.getAll(user));
        map.put("groceryLists", groceryListsWithIngredients);

        return objectMapper.writeValueAsBytes(map);
    }
}