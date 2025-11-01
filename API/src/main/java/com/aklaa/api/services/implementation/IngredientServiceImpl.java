package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.IngredientRepository;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.mapper.IngredientMapper;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.services.contract.IngredientService;
import org.springframework.stereotype.Service;

@Service
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

    @Override
    public Ingredient create(IngredientRequestDTO ingredientRequestDTO) {
        return ingredientRepository.save(ingredientMapper.toEntity(ingredientRequestDTO));
    }
}
