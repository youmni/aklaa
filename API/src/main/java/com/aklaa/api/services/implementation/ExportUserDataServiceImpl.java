package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExportUserDataServiceImpl implements ExportUserDataService {

    private final UserService userService;
    private final DishService dishService;
    private final IngredientService ingredientService;
    private final GroceryListService groceryListService;
    private final ObjectMapper objectMapper;

    @Override
    public byte[] getUserData(User user) throws JsonProcessingException {
        Map<String, Object> map = new HashMap<>();
        map.put("user", userService.get(user.getId()));
        map.put("ingredients", ingredientService.getAll(user));
        map.put("dishes", dishService.getAll(user));
        map.put("grocerylists", groceryListService.getAll(user));

        return objectMapper.writeValueAsBytes(map);
    }
}