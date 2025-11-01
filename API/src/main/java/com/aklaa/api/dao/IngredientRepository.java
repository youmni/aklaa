package com.aklaa.api.dao;

import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long>, JpaSpecificationExecutor<Ingredient> {
    Optional<Ingredient> findByName(String name);
    List<Ingredient> findByUser(User user);
}
