package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.DishRepository;
import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.request.DishIngredientRequestInfoDTO;
import com.aklaa.api.mapper.DishIngredientMapper;
import com.aklaa.api.mapper.DishMapper;
import com.aklaa.api.model.Dish;
import com.aklaa.api.model.DishIngredient;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.CuisineType;
import com.aklaa.api.model.enums.DishTag;
import com.aklaa.api.services.contract.DishService;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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

        for (DishIngredientRequestInfoDTO ingredientInfo : dishRequestDTO.getIngredients()) {
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

    @Override
    @Transactional
    public DishResponseDTO update(DishRequestDTO dishRequestDTO, Long id, User user) {
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Dish not found with id: " + id));

        if (!existingDish.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to update this dish");
        }

        existingDish.setName(dishRequestDTO.getName());
        existingDish.setDescription(dishRequestDTO.getDescription());
        existingDish.setTags(dishRequestDTO.getTags());
        existingDish.setType(dishRequestDTO.getType());
        existingDish.setCookingSteps(dishRequestDTO.getCookingSteps());
        existingDish.setImageUrl(dishRequestDTO.getImageUrl());
        existingDish.setPeople(dishRequestDTO.getPeople());

        existingDish.getDishIngredients().clear();

        for (DishIngredientRequestInfoDTO ingredientInfo : dishRequestDTO.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ingredientInfo.getIngredientId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "Ingredient not found with id: " + ingredientInfo.getIngredientId()
                    ));

            DishIngredient dishIngredient = dishIngredientMapper.toEntity(existingDish, ingredient, ingredientInfo.getQuantity());
            dishIngredient.setDish(existingDish);
            dishIngredient.setIngredient(ingredient);

            existingDish.getDishIngredients().add(dishIngredient);
        }
        Dish savedDish = dishRepository.save(existingDish);

        return dishMapper.toResponseDTO(savedDish);
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
