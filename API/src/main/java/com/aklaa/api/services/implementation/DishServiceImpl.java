package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.RecipeStepRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.request.DishIngredientRequestInfoDTO;
import com.aklaa.api.mapper.DishIngredientMapper;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.model.*;
import com.aklaa.api.model.enums.CuisineType;
import com.aklaa.api.services.contract.DishService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final DishMapper dishMapper;
    private final DishIngredientMapper dishIngredientMapper;
    private final IngredientRepository ingredientRepository;

    @Override
    @Transactional
    public DishResponseDTO create(DishRequestDTO dto, User user) {
        Dish dish = dishMapper.toEntity(dto, user);

        dto.getIngredients().forEach(info -> {
            Ingredient ingredient = ingredientRepository.findById(info.getIngredientId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "Ingredient not found with id: " + info.getIngredientId()
                    ));

            dish.getDishIngredients().add(
                    dishIngredientMapper.toEntity(dish, ingredient, info.getQuantity())
            );
        });

        dish.getSteps().addAll(dishMapper.toRecipeSteps(dto.getSteps(), dish));

        Dish savedDish = dishRepository.save(dish);
        return dishMapper.toResponseDTO(savedDish);
    }

    @Override
    @Transactional
    public DishResponseDTO update(DishRequestDTO dto, Long id, User user) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Dish not found with id: " + id));

        if (!dish.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to update this dish");
        }

        dishMapper.updateEntity(dish, dto);

        dish.replaceIngredients(
                dto.getIngredients(),
                ingredientId -> ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new NoSuchElementException(
                                "Ingredient not found with id: " + ingredientId
                        ))
        );

        dish.replaceSteps(dishMapper.toRecipeSteps(dto.getSteps(), dish));

        return dishMapper.toResponseDTO(dish);
    }

    @Override
    public DishResponseDTO delete(Long id, User user) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Dish not found"));

        if(!dish.getUser().equals(user)){
            throw new AccessDeniedException("Access denied");
        }

        DishResponseDTO dishResponseDTO = dishMapper.toResponseDTO(dish);
        dishRepository.delete(dish);
        return dishResponseDTO;
    }

    @Override
    public DishResponseDTO get(Long id, User user) {
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Dish not found with id: " + id));

        if (!existingDish.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to update this dish");
        }
        return dishMapper.toResponseDTO(existingDish);
    }

    @Override
    public DishListResponseDTO filter(String search, List<String> countries, Pageable pageable, User user) {
        List<CuisineType> cuisineEnums = null;
        if (countries != null && !countries.isEmpty()) {
            cuisineEnums = countries.stream()
                    .map(c -> {
                        try {
                            return CuisineType.valueOf(c.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .toList();
        }

        Specification<Dish> spec = userSpec(user)
                .and(hasCuisineSpec(cuisineEnums))
                .and(searchSpec(search));

        Page<Dish> dishesPage = dishRepository.findAll(spec, pageable);

        List<DishResponseDTO> dishDTOs = dishesPage.getContent().stream()
                .map(dishMapper::toResponseDTO)
                .toList();

        return DishListResponseDTO.builder()
                .dishes(dishDTOs)
                .totalElements(dishesPage.getTotalElements())
                .totalPages(dishesPage.getTotalPages())
                .build();
    }

    @Override
    public List<DishResponseDTO> getAll(User user) {
        List<Dish> dishes = dishRepository.findByUser(user);

        return dishes.stream()
                .map(dishMapper::toResponseDTO)
                .toList();
    }

    private Specification<Dish> searchSpec(String searchTerm) {
        return (root, query, builder) -> {
            if (searchTerm == null || searchTerm.isEmpty()) {
                return builder.conjunction();
            }

            assert query != null;
            query.distinct(true);
            String likeTerm = "%" + searchTerm.toLowerCase() + "%";

            Join<Dish, DishIngredient> dishIngredientsJoin = root.join("dishIngredients", JoinType.LEFT);
            Join<DishIngredient, Ingredient> ingredientJoin = dishIngredientsJoin.join("ingredient", JoinType.LEFT);

            Predicate namePredicate = builder.like(builder.lower(root.get("name")), likeTerm);
            Predicate descriptionPredicate = builder.like(builder.lower(root.get("description")), likeTerm);
            Predicate ingredientPredicate = builder.like(builder.lower(ingredientJoin.get("name")), likeTerm);

            Predicate tagsPredicate = builder.like(builder.lower(root.get("tags")), likeTerm);

            return builder.or(namePredicate, descriptionPredicate, ingredientPredicate, tagsPredicate);
        };
    }


    private Specification<Dish> hasCuisineSpec(List<CuisineType> cuisines) {
        return (root, query, builder) -> {
            if (cuisines == null || cuisines.isEmpty()) {
                return builder.conjunction();
            }
            return root.get("type").in(cuisines);
        };
    }

    private Specification<Dish> userSpec(User user) {
        return (root, query, builder) -> builder.equal(root.get("user"), user);
    }
}