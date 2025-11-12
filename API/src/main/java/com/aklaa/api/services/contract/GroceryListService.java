package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.response.GroceryListIngredientListResponseDTO;
import com.aklaa.api.dtos.response.GroceryListResponseDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GroceryListService {
    List<CartDishRequestDTO> getCart(HttpSession session);
    List<GroceryListResponseDTO> getGroceryLists(User user, Pageable pageable);
    GroceryListIngredientListResponseDTO getIngredientOfGroceryList(Long id, User user, Pageable pageable);
}
