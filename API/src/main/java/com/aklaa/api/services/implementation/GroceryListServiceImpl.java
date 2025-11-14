package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dao.GroceryListRepository;
import com.aklaa.api.dtos.request.CartDishRequestDTO;
import com.aklaa.api.dtos.response.*;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.GroceryListIngredient;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.GroceryListService;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroceryListServiceImpl implements GroceryListService {

    private final DishRepository dishRepository;
    private final GroceryListRepository groceryListRepository;
    private final DishMapper dishMapper;

    public GroceryListServiceImpl(DishRepository dishRepository, GroceryListRepository groceryListRepository, DishMapper dishMapper) {
        this.dishRepository = dishRepository;
        this.groceryListRepository = groceryListRepository;
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

    @Override
    public List<GroceryListResponseDTO> getGroceryLists(User user, Pageable pageable) {
        return groceryListRepository.findByUser(user, pageable)
                .stream()
                .map(groceryList -> GroceryListResponseDTO.builder()
                        .id(groceryList.getId())
                        .startOfWeek(groceryList.getStartOfWeek())
                        .endOfWeek(groceryList.getEndOfWeek())
                        .build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public GroceryListIngredientListResponseDTO getIngredientOfGroceryList(Long id, User user, Pageable pageable) {
        return groceryListRepository.findByIdAndUser(id, user)
                .map(groceryList -> {
                    List<GroceryListIngredient> allItems = groceryList.getGroceryListIngredients()
                            .stream()
                            .sorted(
                                    Comparator.comparing((GroceryListIngredient item) ->
                                                    item.getIngredient().getCategory())
                                            .thenComparing(item ->
                                                    item.getIngredient().getName())
                            )
                            .toList();

                    List<GroceryListIngredientResponseDTO> pagedIngredients = allItems.stream()
                            .skip(pageable.getOffset())
                            .limit(pageable.getPageSize())
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
                            .collect(Collectors.toList());

                    long totalElements = allItems.size();
                    int totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());

                    return GroceryListIngredientListResponseDTO.builder()
                            .ingredients(pagedIngredients)
                            .totalElements(totalElements)
                            .totalPages(totalPages)
                            .build();
                })
                .orElseGet(() -> GroceryListIngredientListResponseDTO.builder()
                        .ingredients(List.of())
                        .totalElements(0)
                        .totalPages(0)
                        .build());
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
