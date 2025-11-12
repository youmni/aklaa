package com.aklaa.api.dao;

import com.aklaa.api.model.GroceryList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> { }
