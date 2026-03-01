package com.aklaa.api.dao;

import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    Page<GroceryList> findByUser(User user, Pageable pageable);
    List<GroceryList> findByUser(User user);
    Optional<GroceryList> findByIdAndUser(Long id, User user);

    @Query("SELECT DISTINCT g FROM GroceryList g " +
           "LEFT JOIN FETCH g.groceryListIngredients gli " +
           "LEFT JOIN FETCH gli.ingredient " +
           "WHERE g.user = :user")
    List<GroceryList> findByUserWithIngredients(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM GroceryList g WHERE g.createdAt < :date")
    void deleteByCreatedAtBefore(@Param("date") OffsetDateTime date);
}
