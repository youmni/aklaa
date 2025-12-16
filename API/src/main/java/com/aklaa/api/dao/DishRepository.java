package com.aklaa.api.dao;

import com.aklaa.api.model.Dish;
import com.aklaa.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long>, JpaSpecificationExecutor<Dish> {
    List<Dish> findByUser(User user);
}
