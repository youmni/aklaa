package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.mapper.IngredientMapper;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.IngredientService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

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
}
