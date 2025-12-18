package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.mapper.IngredientMapper;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.IngredientCategory;
import com.aklaa.api.services.contract.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    @Override
    public IngredientResponseDTO create(IngredientRequestDTO ingredientRequestDTO,  User user) {
        Ingredient ingredient = ingredientMapper.toEntity(ingredientRequestDTO);
        ingredient.setUser(user);
        ingredientRepository.save(ingredient);
        return ingredientMapper.toResponseDTO(ingredient);
    }

    @Override
    public IngredientResponseDTO update(IngredientRequestDTO ingredientRequestDTO, Long id, User user) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ingredient not found"));

        if(!ingredient.getUser().equals(user)){
            throw new AccessDeniedException("Access denied");
        }

        ingredient.setName(ingredientRequestDTO.getName());
        ingredient.setDescription(ingredientRequestDTO.getDescription());
        ingredient.setCategory(ingredientRequestDTO.getCategory());
        ingredient.setUnit(ingredientRequestDTO.getUnit());
        ingredientRepository.save(ingredient);
        return ingredientMapper.toResponseDTO(ingredient);
    }

    @Override
    public IngredientResponseDTO delete(Long id, User user) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ingredient not found"));

        if(!ingredient.getUser().equals(user)){
            throw new AccessDeniedException("Access denied");
        }

        ingredientRepository.delete(ingredient);
        return ingredientMapper.toResponseDTO(ingredient);
    }
    @Override
    public IngredientListResponseDTO filter(String search, List<String> categories, Pageable pageable, User user) {
        List<IngredientCategory> categoryEnums = null;
        if (categories != null && !categories.isEmpty()) {
            categoryEnums = categories.stream()
                    .map(cat -> {
                        try {
                            return IngredientCategory.valueOf(cat.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .toList();
        }

        Specification<Ingredient> spec = searchSpec(search)
                .and(hasCategoriesSpec(categoryEnums))
                .and(userSpec(user));

        Page<Ingredient> ingredientsPage = ingredientRepository.findAll(spec, pageable);

        List<IngredientResponseDTO> ingredientDTOs = ingredientsPage.getContent().stream()
                .map(ingredient -> IngredientResponseDTO.builder()
                        .id(ingredient.getId())
                        .name(ingredient.getName())
                        .description(ingredient.getDescription())
                        .category(ingredient.getCategory())
                        .unit(ingredient.getUnit())
                        .build())
                .toList();

        return IngredientListResponseDTO.builder()
                .ingredients(ingredientDTOs)
                .totalElements(ingredientsPage.getTotalElements())
                .totalPages(ingredientsPage.getTotalPages())
                .build();
    }

    @Override
    public IngredientResponseDTO get(Long id, User user) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ingredient not found"));

        if(!ingredient.getUser().equals(user)){
            throw new AccessDeniedException("Access denied");
        }
        return ingredientMapper.toResponseDTO(ingredient);
    }

    @Override
    public List<IngredientResponseDTO> getAll(User user) {

        List<Ingredient> ingredients = ingredientRepository.findAllByUser(user);

        return ingredients.stream()
                .sorted(
                        Comparator.comparing(Ingredient::getCategory)
                                .thenComparing(Ingredient::getName)
                )
                .map(ingredient -> IngredientResponseDTO.builder()
                        .id(ingredient.getId())
                        .name(ingredient.getName())
                        .description(ingredient.getDescription())
                        .category(ingredient.getCategory())
                        .unit(ingredient.getUnit())
                        .build())
                .toList();
    }

    private Specification<Ingredient> hasCategoriesSpec(List<IngredientCategory> categories) {
        return (root, query, builder) -> {
            if (categories == null || categories.isEmpty()) {
                return builder.conjunction();
            }
            return root.get("category").in(categories);
        };
    }

    private Specification<Ingredient> searchSpec(String searchTerm) {
        return (root, query, builder) -> {
            if (searchTerm == null || searchTerm.isEmpty()) {
                return builder.conjunction();
            }
            String likeTerm = "%" + searchTerm.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("name")), likeTerm),
                    builder.like(builder.lower(root.get("description")), likeTerm)
            );
        };
    }

    private Specification<Ingredient> userSpec(User user) {
        return (root, query, builder) -> builder.equal(root.get("user"), user);
    }
}
